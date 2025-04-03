import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {PermissionsAndroid, Platform} from 'react-native';

interface ToastType {
  show: (type: 'success' | 'error', options: {message: string}) => void;
}

export const saveImageToGallery = async (
  imageUrl: string,
  toast?: ToastType,
): Promise<boolean> => {
  try {
    // 1. 验证URL格式
    if (!imageUrl.startsWith('http')) {
      throw new Error('无效的图片URL');
    }

    // 2. 下载图片到临时目录
    const downloadDest = `${RNFS.CachesDirectoryPath}/${Date.now()}.jpg`;
    const response = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadDest,
    }).promise;

    if (response.statusCode !== 200) {
      toast?.show('error', {message: '图片下载失败'});
      return false;
    }

    // 3. Android权限检查
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '存储权限',
          message: '需要权限保存图片到相册',
          buttonPositive: '同意',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        toast?.show('error', {message: '未授予存储权限'});
        return false;
      }
    }

    // 4. 保存到相册
    await CameraRoll.saveAsset(downloadDest, {type: 'photo'});
    toast?.show('success', {message: '图片已保存到相册'});
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    toast?.show('error', {message: `保存失败: ${errorMessage}`});
    return false;
  }
};

// 扩展支持多种图片类型
interface SaveImageOptions {
  toast?: ToastType;
  fileName?: string;
}

export const saveAnyImageToGallery = async (
  image: string,
  options: SaveImageOptions = {},
): Promise<boolean> => {
  const {toast, fileName = `${Date.now()}.jpg`} = options;

  try {
    let tempPath: string;

    if (image.startsWith('http')) {
      // 网络图片
      tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      const response = await RNFS.downloadFile({
        fromUrl: image,
        toFile: tempPath,
      }).promise;

      if (response.statusCode !== 200) {
        throw new Error('图片下载失败');
      }
    } else if (image.startsWith('data:image')) {
      // Base64图片
      tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.writeFile(tempPath, image, 'base64');
    } else if (
      image.startsWith('file://') ||
      image.startsWith(RNFS.DocumentDirectoryPath)
    ) {
      // 本地文件路径
      tempPath = image;
    } else {
      throw new Error('不支持的图片格式');
    }

    // 后续保存逻辑
    return saveImageToGallery(tempPath, toast);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '保存失败';
    toast?.show('error', {message: errorMessage});
    return false;
  }
};
