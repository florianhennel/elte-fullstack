import sprites from './sprites.json'

class Resources {
  constructor() {
    // Everything we plan to download
    this.toLoad = sprites;

    // A bucket to keep all of our images
    const target = new Map()
    const handler = {
      get(obj, name) {
        console.assert(target.has(name), "Resource not found")
        return target.get(name)
      },

      set() {
        console.assert(false, "Trying to set a new resource")
      }
    }

    this.images = new Proxy(target, handler);

    // Load each image
    Object.keys(this.toLoad).forEach(key => {
      const img = new Image();
      img.src = this.toLoad[key];
      target.set(key, {
        image: img,
        isLoaded: false
      })
      img.onload = () => {
        target.get(key).isLoaded = true;
      }
    })
  }
}

// Create one instance for the whole app to use
export const resources = new Resources();
