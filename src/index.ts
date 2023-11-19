import "./index.html";
import "./index.scss";
import { drawHeader } from "./modules/main/header";
import { createApp, createAppContent, showApp } from "./modules/main/app";
import { initRouter } from "./router/router";

drawHeader();
createApp();
createAppContent();
initRouter();
showApp();
