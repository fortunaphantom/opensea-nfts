import axios from 'axios';

const API_KEY = process.env.REACT_APP_PINATA_API_KEY || "";
const API_SECRET = process.env.REACT_APP_PINATA_API_SECRET || "";
const pinataUrl = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

export const pinFileList = (files: any[]) => {
  const fData = new FormData();

  console.log(files);
  for (let i = 0; i < files.length; i++) {
    fData.append('file', files[i], `a/${i}.png`);
  }
  fData.append(
    'pinataMetadata',
    JSON.stringify({
      name: `image-${Date.now()}`,
    })
  );

  return axios.post(pinataUrl, fData, {
    maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large directories
    headers: {
      'Content-Type': `multipart/form-data; boundary=${(fData as any)._boundary}`,
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
    },
  } as any);
};

export const pinMetadataList = async (data: any[]) => {
  const fData = new FormData();

  for (let i = 0; i < data.length; i++) {
    let file = new File(
      [JSON.stringify(data[i], null, 2)],
      `metadata/${i}.json`,
      {
        type: 'application/json',
      }
    );
    fData.append('file', file);
  }

  // fData.append(
  //   'pinataMetadata',
  //   JSON.stringify({
  //     name: `metadata-${Date.now()}`,
  //   })
  // );

  return axios.post(pinataUrl, fData, {
    maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
    headers: {
      'Content-Type': `multipart/form-data; boundary=${(fData as any)._boundary}`,
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
    },
  } as any);
};
