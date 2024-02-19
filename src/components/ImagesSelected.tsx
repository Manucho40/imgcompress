import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import imageCompression from 'browser-image-compression';
import { ErrorType } from '../App';
import JSZip from 'jszip';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  type Props = {
    setErrorAlert: any
  }
const ImagesSelected: React.FC <Props>  = ({setErrorAlert}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },

  ]);

  const [loading, setLoading] = useState<Boolean>(false)
  const [fileListCompress, setFileListCompress] = useState<any>([])
  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }


  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const compression = async (event: any) => {
    try {
      const tab: any[] = []
      if(fileList.length > 0) {
        setLoading(true)
        const options = {
          maxSizeMB: 0.500,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        };
        await Promise.all(fileList.map(async (index: any) => {
          const img = await imageCompression(index.originFileObj, options);
          tab.push(img);
       }));
       setFileListCompress(tab)
       setLoading(false);
      }else {
        setErrorAlert({
          message: "Warning",
          description: "Selectionnez une image !",
          type: "warning",
        });
      }
    } catch (error) {
      setErrorAlert({
        message: "Error",
        description: "Une erreur s'est produite lors de la compression !",
        type: "Error",
      });
    }
  }
  // Téléchargement des images comprésser dans un fichier zip
  const downloadZip = () => {
    if (fileListCompress.length === 0) {
      setErrorAlert("Le tableau fileListCompress est vide");
      return;
    }

    const zip = new JSZip();

    fileListCompress.forEach((file: Blob, index: number) => {
      const fileName = `image_${index + 1}.jpg`; // Ajustement du nom du fichier
      zip.file(fileName, file);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const zipBlob = new Blob([content]);
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'compressed_images.zip';
      a.click();
    });
  };
  const reset = () => {
    setFileList([])
    setFileListCompress([])
  }
  return (
    <>
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-card"
        fileList={fileList}
        maxCount={10}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
        beforeUpload={() => false}
      >
        {/* {fileList.length >= 20 ? null : uploadButton} */}
        {uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Button type="primary"  size={size} onClick={compression}>
        {loading ? ("Chargement...") : ("Compresser")}
      </Button>
      <Button type="primary"  size={size} onClick={reset} danger style={{marginLeft: 20}}>
        Reinitialiser
      </Button>
      {
        fileListCompress.length > 0 ? (<Button type="text" size="large" style={{marginLeft: 20}} onClick={downloadZip}>
        Télécharger
      </Button>) : null
      }
      
    </>
  );
};

export default ImagesSelected;