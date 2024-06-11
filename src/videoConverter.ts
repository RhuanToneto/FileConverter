import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath.path);

const inputDir = path.join(__dirname, '../arquivos');
const outputDir = path.join(inputDir, 'convertidos');

export const convertVideo = (fileName: string, outputFormat: 'mp4' | 'mp3') => {
    return new Promise<void>((resolve, reject) => {
        const inputPath = path.join(inputDir, fileName);
        const outputPath = path.join(outputDir, path.parse(fileName).name + `.${outputFormat}`);

        if (!fs.existsSync(inputPath)) {
            console.error(`Arquivo não encontrado: ${inputPath}`);
            resolve();
            return;
        }

        ffmpeg(inputPath)
            .toFormat(outputFormat)
            .on('end', () => {
                console.log(`Vídeo convertido com sucesso: ${outputPath}`);
                resolve();
            })
            .on('error', (error: any) => {
                console.error(`Erro ao converter vídeo: ${error}`);
                reject(error);
            })
            .save(outputPath);
    });
};
