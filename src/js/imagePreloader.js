/* eslint-disable */
export default class imagePreloader {
    constructor (options) {
    	this.images = options.images
    	this.loaded = 0
		this.callback = options.callback
        this.preload()
    }

    preload() {
		for (let i = 0; i < this.images.length; i++) {
			let img = new Image()
			img.onload = () => {
				this.loaded++
				this.checkCallback()
			}
			img.src = this.images[i]
		}	
	}

	checkCallback() {
		if (this.loaded == this.images.length) {
			if (this.callback) {
				this.callback()
			}
			else {
				console.log('images loaded!')
			}
		}
	}
}