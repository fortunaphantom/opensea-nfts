import React, { useState } from 'react';
import { Button, Link, TextField } from '@mui/material';
import styled from 'styled-components';
import { pinFileList, pinMetadataList } from 'utils/pinata';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'actions/viewStates';
import config from 'utils/config';
import { NotificationManager } from 'components/Notification';
import contractAbi from 'contracts/Nfty_Nft.json';
import Web3 from 'web3';
import { addCollectionApi } from 'utils/api';

interface ICreatePage {}

const CreatePage = (props: ICreatePage) => {
  const [imageCnt, setImageCnt] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImagePath, setUploadedImagePath] = useState('');
  const [uploadedCollectionImagePath, setUploadedCollectionImagePath] = useState('');
  const [uploadedMetadataPath, setUploadedMetadataPath] = useState('');
  const [uploadedCollectionMetadataPath, setUploadedCollectionMetadataPath] = useState('');
  const [collectionImage, setCollectionImage] = useState<any>(null);
  const web3 = useSelector<any, any>(state => state.web3.web3);
  const selectedAddress = useSelector<any, any>(state => state.web3.selectedAddress);

  const [formData, setFormData] = useState<any>({
    royaltyAddresses: [],
    royaltyPercents: []
  });
  const dispatch = useDispatch() as any;

  const onChangeField = (e: any, field: string, index: number = -1) => {
    if (index === -1) {
      setFormData({
        ...formData,
        [field]: e.target.value
      });
    } else {
      if (!formData[field]) {
        formData[field] = [];
      }
      formData[field][index] = e.target.value;
      setFormData({...formData});
    }
  }

  const onChangeImages = (e: any) => {
    setImageFiles(e.target.files);
    setImageCnt(e.target.files.length);
  };

  const onChangeCollectionImage = (e: any) => {
    setCollectionImage(e.target.files[0]);
  };

  const validate = () => {
    console.log(formData);
    if (!formData.name || !formData.symbol || !formData.description || !formData.quantity || !formData.price || !formData.maxlimit) {
      NotificationManager.warning('Please input all fields', 'Input fields');
      return false;
    }

    const quantity = Number(formData.quantity);
    const price = Number(formData.price);
    const maxlimit = Number(formData.maxlimit);

    if (!quantity || Number.isNaN(quantity)) {
      NotificationManager.warning('Please input quantity', 'Quantity');
      return false;
    }

    if (!maxlimit || Number.isNaN(maxlimit)) {
      NotificationManager.warning('Please input max limit', 'Max limit');
      return false;
    }

    if (Number.isNaN(price)) {
      NotificationManager.warning('Please input price', 'Price');
      return false;
    }

    return true;
  };

  const onCreateCollection = async () => {
    if (!web3) {
      NotificationManager.warning("Not connected to metamask", "Not connected");
      return;
    }

    if (!collectionImage) {
      NotificationManager.warning("Not selected collection image", "Not selected collection image");
      return;
    }

    if (imageFiles.length === 0) {
      NotificationManager.warning("Not selected art image", "Not selected art image");
      return;
    }

    if (!validate()) {
      return;
    }

    const royaltyAddresses = [];
      const royaltyPercents = [];
      let sum = 0;
      for (let i = 0; i < formData.royaltyAddresses.length; i++) {
        if (!formData.royaltyAddresses) {
          break;
        }
        royaltyAddresses[i] = formData.royaltyAddresses[i];
        royaltyPercents[i] = Number(formData.royaltyPercents[i]);
        sum += royaltyPercents[i];
      }

      if (sum > 100) {
        NotificationManager.warning("Sum of royalty percents should not exceed 100", "Royalty percent");
        return;
      }

    dispatch(setLoading(true));
    try {
      let ipfsRes = await pinFileList([collectionImage]);
      const _uploadedCollectionImagePath = config.pinataGateway + ipfsRes.data.IpfsHash + "/0.png";
      setUploadedCollectionImagePath(_uploadedCollectionImagePath);

      ipfsRes = await pinMetadataList([{
        name: formData.name || "",
        description: formData.description || "",
        image: _uploadedCollectionImagePath || "",
        external_link: _uploadedCollectionImagePath || "",
        category: formData.category || ""
      }]);
      const _uploadedCollectionMetadataPath = config.pinataGateway + ipfsRes.data.IpfsHash + "/0.json";
      setUploadedCollectionMetadataPath(_uploadedCollectionMetadataPath);

      ipfsRes = await pinFileList(imageFiles);
      const _uploadedImagePath = config.pinataGateway + ipfsRes.data.IpfsHash;
      setUploadedImagePath(_uploadedImagePath);

      const metadata = [];
      for (let i = 0; i < imageFiles.length; i++) {
        metadata.push({
          image: _uploadedImagePath + `/${i}.png`,
          external_url: _uploadedImagePath + `/${i}.png`,
          description: `Description-${i}`,
          name: `Name-${i}`,
          attributes: [
            {
              trait_type: 'Name',
              value: 'Name-' + i,
            },
            {
              trait_type: 'Description',
              value: 'Description-' + i,
            },
          ],
        });
      }
      ipfsRes = await pinMetadataList(metadata);
      const _uploadedMetadataPath = config.pinataGateway + ipfsRes.data.IpfsHash;
      setUploadedMetadataPath(_uploadedMetadataPath);

      const postData = {
        collectionName: formData.name || "",
        collectionSymbol: formData.symbol || "",
        description: formData.description || "",
        externalUrl: _uploadedCollectionImagePath || "",
        imageUrl: _uploadedCollectionImagePath || "",
        category: formData.category || "",
        price: Number(formData.price) || 0,
        quantity: Number(formData.quantity) || 0,
        maxPerWallet: Number(formData.maxlimit) || 1,
        royaltyAddresses,
        royaltyPercents,
        chainId: window.ethereum.networkVersion,
      };

      const {data} = await addCollectionApi(postData);
      console.log({selectedAddress});

      const bytecode = config.bytecode;
      const contract = new web3.eth.Contract(contractAbi);
      await contract
        .deploy({
          data: bytecode,
          arguments: [
            [
              data.HashValue,
              config.whitelabelId,
              postData.collectionName,
              postData.collectionSymbol,
              _uploadedMetadataPath,
              _uploadedCollectionMetadataPath,
              Web3.utils.toWei(String(data.Price)),
              data.Quantity,
              royaltyAddresses,
              royaltyPercents,
              data.SuperAdminAddress,
              data.SuperAdminPercent,
              data.MaxPerWallet
            ]
          ],
        })
        .send({ from: selectedAddress });
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading(false));
  };

  return (
    <HomeComponent>
      <form onSubmit={onCreateCollection}>
        <FormRow>
          <label>Asset Images</label>
          <label htmlFor='button-asset-images'>
            <HiddenInput
              type='file'
              id='button-asset-images'
              name='image'
              multiple={true}
              onChange={onChangeImages}
              required={true}
            />
            <Button variant='contained' component='span'>
              Select Images
            </Button>
          </label>
          <div className='content'>{imageCnt ? `${imageCnt} Images` : ''}</div>
        </FormRow>
        <FormRow>
          <label>Collection Image</label>
          <label htmlFor='button-collection-images'>
            <HiddenInput
              type='file'
              id='button-collection-images'
              name='image'
              onChange={onChangeCollectionImage}
              required={true}
            />
            <Button variant='contained' component='span'>
              Select Image
            </Button>
          </label>
        </FormRow>
        {uploadedCollectionImagePath && (
          <FormRow>
            <label>IPFS Collection Image Url</label>
            <Link href={uploadedCollectionImagePath} target='_blank' rel='noopener'>
              {uploadedCollectionImagePath}
            </Link>
          </FormRow>
        )}
        {uploadedCollectionMetadataPath && (
          <FormRow>
            <label>IPFS Collection Metadata Url</label>
            <Link href={uploadedCollectionMetadataPath} target='_blank' rel='noopener'>
              {uploadedCollectionMetadataPath}
            </Link>
          </FormRow>
        )}
        {uploadedImagePath && (
          <FormRow>
            <label>IPFS Image Url</label>
            <Link href={uploadedImagePath} target='_blank' rel='noopener'>
              {uploadedImagePath}
            </Link>
          </FormRow>
        )}
        {uploadedMetadataPath && (
          <FormRow>
            <label>IPFS Metadata Url</label>
            <Link href={uploadedMetadataPath} target='_blank' rel='noopener'>
              {uploadedMetadataPath}
            </Link>
          </FormRow>
        )}
        <FormRow1>
          <TextField
            label='Collection Name'
            variant='outlined'
            size='small'
            required={true}
            value={formData.name || ""}
            onChange={(e) => onChangeField(e, "name")}
          />
          <TextField
            label='Collection Symbol'
            variant='outlined'
            size='small'
            required={true}
            value={formData.symbol || ""}
            onChange={(e) => onChangeField(e, "symbol")}
          />
          <TextField
            label='Collection Category'
            variant='outlined'
            size='small'
            required={true}
            value={formData.category || ""}
            onChange={(e) => onChangeField(e, "category")}
          />
        </FormRow1>
        <FormRow1>
          <TextField
            label='Description'
            variant='outlined'
            size='small'
            multiline
            required={true}
            value={formData.description || ""}
            onChange={(e) => onChangeField(e, "description")}
          />
        </FormRow1>
        <FormRow1>
          <TextField
            label='Quantity'
            variant='outlined'
            size='small'
            required={true}
            value={formData.quantity || ""}
            onChange={(e) => onChangeField(e, "quantity")}
          />
          <TextField
            label='Max limit per wallet'
            variant='outlined'
            size='small'
            required={true}
            value={formData.maxlimit || ""}
            onChange={(e) => onChangeField(e, "maxlimit")}
          />
          <TextField
            label='Price'
            variant='outlined'
            size='small'
            required={true}
            value={formData.price || ""}
            onChange={(e) => onChangeField(e, "price")}
          />
        </FormRow1>
        {Array.from({length: 5}, (_, i) => i).map(i => (
          <FormRow1 key={"royalty" + i}>
            <TextField
              label={'Royalty Address' + i}
              variant='outlined'
              size='small'
              required={true}
              value={formData.royaltyAddresses[i] || ""}
              onChange={(e) => onChangeField(e, "royaltyAddresses", i)}
            />
            <TextField
              label={'Royalty Percent' + i}
              variant='outlined'
              size='small'
              required={true}
              value={formData.royaltyPercents[i] || ""}
              onChange={(e) => onChangeField(e, "royaltyPercents", i)}
            />
          </FormRow1>
        ))}
        <FormRow>
          <Button
            variant='contained'
            component='span'
            onClick={onCreateCollection}
          >
            Create Collection
          </Button>
        </FormRow>
      </form>
    </HomeComponent>
  );
};

export default CreatePage;

const HomeComponent = styled.div`
  padding: 20px calc(50% - 500px);
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  gap: 10px;
`;

const FormRow1 = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;
  gap: 10px;

  & > div {
    flex: 1;
  }
`;
