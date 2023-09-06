import { initNavbar, setupMoonText } from "./lib.js";
import './style.css';

const body = document.querySelector("body");
initNavbar(body);

const data = await fetch('data/intro.json').then(response => response.json());

const introPara = document.getElementById('intro');
introPara.innerHTML = data.intro;

const medPara = document.getElementById('med');
medPara.innerHTML = data.meditate;

setInterval(setupMoonText(), 200);