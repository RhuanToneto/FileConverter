import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const inputDir = path.join(__dirname, '../arquivos');
const outputDir = path.join(inputDir, 'convertidos');

export const convertImage = async (fileName: string, outputFormat: 'png' | 'jpg') => {
    try {
        const inputPath = path.join(inputDir, fileName);
        const outputPath = path.join(outputDir, path.parse(fileName).name + `.${outputFormat}`);

        if (!fs.existsSync(inputPath)) {
            console.error(`Arquivo não encontrado: ${inputPath}`);
            return;
        }

        await sharp(inputPath).toFormat(outputFormat).toFile(outputPath);

        console.log(`Imagem convertida com sucesso: ${outputPath}`);
    } catch (error) {
        console.error(`Erro ao converter imagem: ${error}`);
    }
};
