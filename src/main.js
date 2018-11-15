/*  eslint-disable */
/* global window */
import Mads from 'mads-custom';
import './main.css';

import Eraser from './js/eraser';
import imagePreloader from './js/imagePreloader'

class AdUnit extends Mads {
    constructor() {
        super();
    }

    fixAdSize() {
        if (window.ad.custTracker.length > 0) {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            w = Math.round(w / 10) * 10;
            h = Math.round(h / 10) * 10;
            document.getElementById('rma-widget').style.width = w.toString() + 'px';
            document.getElementById('rma-widget').style.height = h.toString() + 'px';
            console.log(w.toString() + 'x' + h.toString());
            return w.toString() + 'x' + h.toString();
        }
        else {
            document.getElementById('rma-widget').style.width = '320px';
            document.getElementById('rma-widget').style.height = '480px';
            return '320x480';
        }
  }

    render() {
        // this.custTracker = ['http://www.tracker2.com?type={{rmatype}}&tt={{rmatt}}', 'http://www.tracker.com?type={{rmatype}}'];

        // this.tracker('CTR', 'test');

        // this.linkOpener('http://www.google.com');

        return `
            <div class="container">
                <div class="header">
                    <img id="lamp" />
                    <img id="logo" />
                </div>
                <div class="bg">
                    <img id="bg1"/>
                    <img id="bg2"/>
                </div>
                <div id="eraserWrapper">
                    <img id="card1" />
                    <img id="card2" />
                </div>
                <img id="icon1" />
                <img id="icon2" />
                <img id="icon3" />
                <div id="ct">
                    <img id="cta1" />
                    <img id="cta2" />
                </div>
                <img id="gesture" src="${this.data.gesture}"/>
           </div>
            `;
    }

    style() {
        const links = [];

        return [...links,
            `
            .container, #first, #second {
                width : ${this.data.width}px;
                height : ${this.data.height}px;
            }
            #clickthrough {
                top : ${this.data.top}px;
                left : ${this.data.left}px;
            }
            `
        ];
    }

    events() {
        this.adSize = this.fixAdSize()
        this.preloadImages()
        this.setPosition()
    }

    preloadImages() {
        this.firstBatch = new imagePreloader({
            images: [
                this.data[this.adSize].lamp, 
                this.data[this.adSize].logo, 
                this.data[this.adSize].bg1, 
                this.data[this.adSize].card1,
                this.data[this.adSize].card2,
            ],
            callback: () => {
                this.firstRender()
            }
        })
    }

    applyStyles(ele, styleObject) {
        for (var s in styleObject) {
            ele.style[s] = styleObject[s]
        }
    }

    setPosition() {
        this.applyStyles(document.getElementById('logo'), this.data.styles[this.adSize].logo)
        this.applyStyles(document.getElementById('eraserWrapper'), this.data.styles[this.adSize].eraser)
        this.applyStyles(document.getElementById('icon1'), this.data.styles[this.adSize].icon1)
        this.applyStyles(document.getElementById('icon2'), this.data.styles[this.adSize].icon2)
        this.applyStyles(document.getElementById('icon3'), this.data.styles[this.adSize].icon3)
        this.applyStyles(document.getElementById('ct'), this.data.styles[this.adSize].ct)
        this.applyStyles(document.getElementById('gesture'), this.data.styles[this.adSize].gesture)
    }

    firstRender() {
        document.getElementById('lamp').src = this.data[this.adSize].lamp
        document.getElementById('lamp').classList.add('slideDown')
        document.getElementById('logo').src = this.data[this.adSize].logo
        document.getElementById('bg1').src = this.data[this.adSize].bg1
        document.getElementById('card1').src = this.data[this.adSize].card1
        document.getElementById('card2').src = this.data[this.adSize].card2

        setTimeout(() => {
            this.eraser = new Eraser({
                ele: document.getElementById('card1'),
                completeRatio: 0.5,
                width: 260,
                height: 341,
                startFunction: () => {
                    document.getElementById('gesture').style.display = 'none'
                },
                completeFunction: function() {
                    this.reveal()
                    ad.completeScratch()
                }
            })
        }, 300)
        
        this.secondBatch = new imagePreloader({
            images: [
                this.data[this.adSize].bg2,
                this.data[this.adSize].icon1,
                this.data[this.adSize].icon2,
                this.data[this.adSize].icon3,
                this.data[this.adSize].cta1,
                this.data[this.adSize].cta2,
            ],
            callback: () => {
                this.secondRender()
            }
        })
    }

    secondRender() {
        document.getElementById('bg2').src = this.data[this.adSize].bg2
        document.getElementById('icon1').src = this.data[this.adSize].icon1
        document.getElementById('icon2').src = this.data[this.adSize].icon2
        document.getElementById('icon3').src = this.data[this.adSize].icon3
        document.getElementById('cta1').src = this.data[this.adSize].cta1
        document.getElementById('cta2').src = this.data[this.adSize].cta2
    }

    completeScratch() {
        setTimeout(() => {
            document.getElementById('icon1').style.display = 'block'
        }, 300)
        setTimeout(() => {
            document.getElementById('icon2').style.display = 'block'
        }, 1000)
        setTimeout(() => {
            document.getElementById('icon3').style.display = 'block'
        }, 1700)
        setTimeout(() => {
            document.getElementById('bg1').style.opacity = 0
            document.getElementById('bg2').style.opacity = 1
        }, 2500)
        setTimeout(() => {
            document.getElementById('ct').style.display = 'block'
            document.getElementById('ct').addEventListener('click', () => {
                this.tracker('CTR', 'clickthrough')
                this.linkOpener(this.data.clickthrough)
            })
        }, 2800)
    }
}

window.ad = new AdUnit();