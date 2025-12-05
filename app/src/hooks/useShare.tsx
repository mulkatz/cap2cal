import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useTranslation } from 'react-i18next';

export const useShare = () => {
  const { t } = useTranslation();
  const sharePdfFile = async (pdfBase64Data: string, fileName: string, message?: string) => {
    try {
      // Write file to cache directory
      const writeFileResult = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64Data,
        directory: Directory.Cache,
      });

      // Use the URI from writeFile - Share plugin handles platform differences
      const shareableUri = writeFileResult.uri;

      const canShare = await Share.canShare();
      if (!canShare.value) {
        return;
      }

      await Share.share({
        title: t('share.shareFile', { fileName }),
        text: message || t('share.checkOutPdf', { fileName }),
        files: [shareableUri],
        dialogTitle: t('share.shareFile', { fileName }),
      });
    } catch (error) {
      console.error('Failed to share PDF:', error);
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
