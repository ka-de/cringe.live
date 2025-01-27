# ComfyUI now supports Nvidia Cosmos!

### Text to Video and Image to Video

[![](https://substackcdn.com/image/fetch/w_36,h_36,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F37f0f2fd-d33e-4439-9488-1faa4bd4b8af_144x144.png)](https://substack.com/%40comfyanonymous)[Comfy](https://substack.com/%40comfyanonymous)Jan 17, 202521
#### Share this post

[![](https://substackcdn.com/image/fetch/w_520,h_272,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba114836-d10a-45fa-b195-2eda20c9bf7b_1024x1024.webp)![ComfyUI Blog](https://substackcdn.com/image/fetch/w_36,h_36,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6c9523d5-1c32-4d7b-827b-758f7eaa18d3_512x512.png)ComfyUI BlogComfyUI now supports Nvidia Cosmos!](https://substack.com/home/post/p-154974816?utm_campaign=post&utm_medium=web) Copy linkFacebookEmailNotesMore[8](https://blog.comfy.org/p/comfyui-now-supports-nvidia-cosmos/comments)2Share

This year starts off with a great open model release from Nvidia who released their confusingly marketed Cosmos family of models a few days ago.

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba114836-d10a-45fa-b195-2eda20c9bf7b_1024x1024.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/ba114836-d10a-45fa-b195-2eda20c9bf7b_1024x1024.webp)

Nvidia Cosmos 7B image to video

These models which Nvidia calls "World Models" are actually extremely good SOTA video models. Currently ComfyUI supports specifically the 7B and 14B text to video and image to video diffusion models.

For most users I recommend the 7B models. These ones should fit on a 24GB GPU at full 16 bit precision without offloading but will also work on a 12GB GPU with the automatic ComfyUI weight offloading.

This new release also comes with a new sampler available now in your favorite sampler node: [res\_multistep](https://arxiv.org/abs/2308.02157) which was used by Nvidia in their Cosmos implementation, this sampler can be used with every model supported by ComfyUI and I heard it also gives good results on hunyuan video.

What makes the Nvidia Cosmos a great model:

1. Their VAE is by the most compute/memory efficent video VAE yet. Their VAE is so efficent that you can encode/decode a 1280x704 121 frame video on a 12GB vram GPU without any tiling tricks while being very high quality. This makes it a massive ~50x more memory efficient than the hunyuan video VAE.
2. Non distilled: negative prompts will work and should be easier to train than distilled models like hunyuan video.
3. Image to video that works very well and can be controlled by a prompt. The image to video model behaves like an inpainting model so you can do things like generate from the last frame instead of the first frame or generate the video between two images.
4. This model will always make a video with movement if you generate the required 121 frames. I have never seen it generate a video without movement.

Some downsides:

1. The model really likes 121 frames and starts breaking if you generate less or more frames.
2. The lowest resolution the model can handle is 704x704.
3. Long prompts (a few sentences) are required. The model will not follow the prompt if it is too short.
4. It’s slow. It takes over 10 minutes to generate a 1280x704 121 frame video on a 4090 (perfect for heating your room in winter)

For basic workflows and examples see the: [Nvidia Cosmos examples page](https://comfyanonymous.github.io/ComfyUI_examples/cosmos/)

I’ll leave you with a few examples of what Cosmos can do:

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb92a639e-1caa-4be3-998f-0b84ab802930_1024x1024.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/b92a639e-1caa-4be3-998f-0b84ab802930_1024x1024.webp)

Cosmos 7B image to video using an anime image made with Flux dev

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2f94617c-7117-4aee-bc52-4f8bee02abcf_1280x704.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/2f94617c-7117-4aee-bc52-4f8bee02abcf_1280x704.webp)

Cosmos 7B text to video

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F55761147-0c10-4bec-a284-0c04beaf5419_1280x704.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/55761147-0c10-4bec-a284-0c04beaf5419_1280x704.webp)

Cosmos 7B text to video

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa015f65d-cf0b-4846-80f9-fa7f04a798dd_1280x704.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/a015f65d-cf0b-4846-80f9-fa7f04a798dd_1280x704.webp)

Cosmos 7B text to video

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe334e25c-b7e7-44f9-8aaf-3806d26c5c7c_1280x704.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/e334e25c-b7e7-44f9-8aaf-3806d26c5c7c_1280x704.webp)

Cosmos 7B text to video

[![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F375a11eb-4e0b-433e-b1fd-f473cdd133a8_1024x1024.webp)](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/375a11eb-4e0b-433e-b1fd-f473cdd133a8_1024x1024.webp)

Nvidia Cosmos 7B image to video using an anime image made with NoobAI vpred

As a reminder you can check the [Nvidia Cosmos examples page](https://comfyanonymous.github.io/ComfyUI_examples/cosmos/) for workflows.

For another piece of confusing marketing make sure to check out our 2 year anniversary post where we compare ComfyUI to an operating system:

[![🎂 ComfyUI Turns 2: A Journey and Call for Talent](https://substackcdn.com/image/fetch/w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0f701f76-a1b7-4bdb-804f-b1e525366723_1824x1024.png)
#### 🎂 ComfyUI Turns 2: A Journey and Call for Talent

[Comfy](https://substack.com/profile/309980166-comfy)·Jan 16[Read full story](https://blog.comfy.org/p/comfyui-turns-2-a-journey-and-call)](https://blog.comfy.org/p/comfyui-turns-2-a-journey-and-call)21
#### Share this post

[![](https://substackcdn.com/image/fetch/w_520,h_272,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba114836-d10a-45fa-b195-2eda20c9bf7b_1024x1024.webp)![ComfyUI Blog](https://substackcdn.com/image/fetch/w_36,h_36,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6c9523d5-1c32-4d7b-827b-758f7eaa18d3_512x512.png)ComfyUI BlogComfyUI now supports Nvidia Cosmos!](https://substack.com/home/post/p-154974816?utm_campaign=post&utm_medium=web) Copy linkFacebookEmailNotesMore[8](https://blog.comfy.org/p/comfyui-now-supports-nvidia-cosmos/comments)2Share
#### Discussion about this post

CommentsRestacks![](https://substackcdn.com/image/fetch/w_32,h_32,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack.com%2Fimg%2Favatars%2Fdefault-light.png)[![](https://substackcdn.com/image/fetch/w_32,h_32,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9626e8dd-e1af-47d7-b59c-60babe1c87b9_144x144.png)](https://substack.com/profile/300357875-dmitry-markov?utm_source=comment)[Dmitry Markov](https://substack.com/profile/300357875-dmitry-markov?utm_source=substack-feed-item)[5d](https://blog.comfy.org/p/comfyui-now-supports-nvidia-cosmos/comment/86878007 "Jan 18, 2025, 7:29 AM")

I am very interested in this point. Can it be implemented somehow in Comfyui? (otherwise I am afraid it will be like with other models i.e. the model itself can do a lot of things, but in comfy it is not possible to implement it)

3. Image to video that works very well and can be controlled by a prompt. The image to video model behaves like an inpainting model so you can do things like generate from the last frame instead of the first frame or generate the video between two images.

Expand full commentReplyShare[1 reply](https://blog.comfy.org/p/comfyui-now-supports-nvidia-cosmos/comment/86878007)[![](https://substackcdn.com/image/fetch/w_32,h_32,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack.com%2Fimg%2Favatars%2Fblack.png)](https://substack.com/profile/310897239-serge?utm_source=comment)[serge](https://substack.com/profile/310897239-serge?utm_source=substack-feed-item)[4d](https://blog.comfy.org/p/comfyui-now-supports-nvidia-cosmos/comment/87172924 "Jan 19, 2025, 7:59 PM")

CosmosImageToVideoLatent this node is red outlined and gives an error:

Cannot execute because a node is missing the class\_type property.: Node ID '#83'

I hate these messages every time I try smth new, really? What class type does it need? Why isn't that described int he Nvidia cosmos model comfyui page, as in download this put it there.

