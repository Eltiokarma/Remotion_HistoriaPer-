import { Config } from '@remotion/cli/config';

// Laptop de render: i7-11370H (4 núcleos / 8 hilos). 4 hilos de render; nunca 8.
Config.setConcurrency(4);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
