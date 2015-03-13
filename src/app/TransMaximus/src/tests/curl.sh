#curl -XPOST Content-Type: "multipart/form" localhost:8000 @'/home/sdemmer/dev-env/projects/big_buck_bunny_1080p_stereo.ogg'
curl -v -include -F upload=@'/home/sdemmer/dev-env/projects/big_buck_bunny_1080p_stereo.ogg' localhost:8000/uploads
