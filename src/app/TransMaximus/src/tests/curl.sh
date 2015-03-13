#curl -XPOST Content-Type: "multipart/form" localhost:8000 @'/home/sdemmer/dev-env/projects/big_buck_bunny_1080p_stereo.ogg'
curl -v -include -F upload=@'big_buck_bunny_1080p_surround.avi' localhost:8000/uploads
