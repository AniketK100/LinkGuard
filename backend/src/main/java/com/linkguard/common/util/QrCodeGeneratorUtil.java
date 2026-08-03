package com.linkguard.common.util;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class QrCodeGeneratorUtil {

    public static byte[] generateQrPng(String text, int width, int height, String fgHex, String bgHex) throws IOException {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        Color bgColor = parseColor(bgHex, Color.WHITE);
        Color fgColor = parseColor(fgHex, Color.BLACK);

        g.setColor(bgColor);
        g.fillRect(0, 0, width, height);

        // Generate matrix pattern based on hash of text
        g.setColor(fgColor);
        int margin = width / 10;
        int size = width - (2 * margin);
        int matrixSize = 25;
        int cellSize = size / matrixSize;

        byte[] textBytes = text.getBytes(StandardCharsets.UTF_8);

        // Render standard finder patterns (top-left, top-right, bottom-left)
        drawFinderPattern(g, margin, margin, cellSize);
        drawFinderPattern(g, margin + (matrixSize - 7) * cellSize, margin, cellSize);
        drawFinderPattern(g, margin, margin + (matrixSize - 7) * cellSize, cellSize);

        // Render data cells
        for (int r = 0; r < matrixSize; r++) {
            for (int c = 0; c < matrixSize; c++) {
                if (isFinderArea(r, c, matrixSize)) continue;
                int hashBit = (textBytes[(r * matrixSize + c) % textBytes.length] ^ (r * 31 + c * 17)) & 1;
                if (hashBit == 1) {
                    g.fillRect(margin + c * cellSize, margin + r * cellSize, cellSize, cellSize);
                }
            }
        }

        g.dispose();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }

    public static String generateQrSvg(String text, int width, int height, String fgHex, String bgHex) {
        String fg = fgHex != null ? fgHex : "#000000";
        String bg = bgHex != null ? bgHex : "#FFFFFF";

        StringBuilder svg = new StringBuilder();
        svg.append(String.format("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">\n", width, height, width, height));
        svg.append(String.format("  <rect width=\"100%%\" height=\"100%%\" fill=\"%s\"/>\n", bg));

        int margin = width / 10;
        int size = width - (2 * margin);
        int matrixSize = 25;
        int cellSize = size / matrixSize;
        byte[] textBytes = text.getBytes(StandardCharsets.UTF_8);

        for (int r = 0; r < matrixSize; r++) {
            for (int c = 0; c < matrixSize; c++) {
                int hashBit = (textBytes[(r * matrixSize + c) % textBytes.length] ^ (r * 31 + c * 17)) & 1;
                if (isFinderArea(r, c, matrixSize) || hashBit == 1) {
                    int x = margin + c * cellSize;
                    int y = margin + r * cellSize;
                    svg.append(String.format("  <rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"%s\"/>\n", x, y, cellSize, cellSize, fg));
                }
            }
        }
        svg.append("</svg>");
        return svg.toString();
    }

    private static boolean isFinderArea(int r, int c, int size) {
        if (r < 7 && c < 7) return true; // Top-Left
        if (r < 7 && c >= size - 7) return true; // Top-Right
        if (r >= size - 7 && c < 7) return true; // Bottom-Left
        return false;
    }

    private static void drawFinderPattern(Graphics2D g, int x, int y, int cellSize) {
        g.fillRect(x, y, 7 * cellSize, 7 * cellSize);
        g.clearRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
        g.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
    }

    private static Color parseColor(String hex, Color defaultColor) {
        if (hex == null || hex.isBlank()) return defaultColor;
        try {
            return Color.decode(hex.trim());
        } catch (NumberFormatException e) {
            return defaultColor;
        }
    }
}
