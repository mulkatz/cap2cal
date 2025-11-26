import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useTranslation } from 'react-i18next';

export const useShare = () => {
  const { t } = useTranslation();
  const sharePdfFile = async (pdfBase64Data: string, fileName: string) => {
    try {
      const writeFileResult = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64Data,
        directory: Directory.Cache,
      });

      const nativePath = writeFileResult.uri;

      const canShare = await Share.canShare();
      if (!canShare.value) {
        return;
      }

      await Share.share({
        title: t('share.shareFile', { fileName }),
        text: t('share.checkOutPdf', { fileName }),
        files: [nativePath],
        dialogTitle: t('share.shareFile', { fileName }),
      });
    } catch (error) {
      // Error handling could be enhanced here
    }
  };

  const shareContent = async (item: { title: string; description: string; link: string }) => {
    const message = t('share.checkOutTool', { title: item.title, description: item.description, link: item.link });

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: message,
        });
      } catch (error) {
        // Error handling could be enhanced here
      }
    }
  };

  return { sharePdfFile, shareContent };
};
