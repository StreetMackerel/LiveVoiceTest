/*
{
  "CATEGORIES": [
    "Color Effect"
  ],
  "INPUTS": [
    {
      "NAME": "inputImage",
      "TYPE": "image"
    },
    {
      "NAME": "amount",
      "TYPE": "float",
      "MIN": 0,
      "MAX": 1,
      "DEFAULT": 0.5
    }
  ]
}
*/

void main()
{
	vec4 color = IMG_THIS_PIXEL(inputImage);
	vec3 grayXfer = vec3(0.3, 0.59, 0.11);
	vec3 gray = vec3(dot(grayXfer, color.rgb));
	gl_FragColor = vec4(mix(color.rgb, gray, amount), color.a);
}