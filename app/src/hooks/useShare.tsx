import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const useShare = () => {
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
        title: `Share ${fileName}`,
        text: `Check out this PDF: ${fileName}`,
        files: [nativePath],
        dialogTitle: `Share ${fileName}`,
      });
    } catch (error) {
      // Error handling could be enhanced here
    }
  };

  const shareContent = async (item: { title: string; description: string; link: string }) => {
    const message = `Check out this awesome tool: ${item.title}\n${item.description}\nVisit: ${item.link}`;

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
