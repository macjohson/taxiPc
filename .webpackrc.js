export default {
    proxy: {
        ["/api"]: {
            target: "http://demo.macjohson.com/",
            changeOrigin: true,
        },
        ["/UploadFiles"]:{
            target: "http://demo.macjohson.com/",
            changeOrigin: true,
        }
    }
}
