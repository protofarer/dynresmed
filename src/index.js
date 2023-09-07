import { initNavbar, setupMoonText, initFooter } from "./lib.js";
import './style.css';

const parent = document.querySelector("body");
initNavbar(parent);

const data = await fetch('data/intro.json').then(response => response.json());

const introPara = document.getElementById('intro');
introPara.innerHTML = data.intro;

const medPara = document.getElementById('med');
medPara.innerHTML = data.meditate;

// setInterval(setupMoonText(), 200);