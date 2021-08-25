/*
{
  "CATEGORIES": [
    "Glitch"
  ],
  "INPUTS": [
    {
      "NAME": "source",
      "TYPE": "image"
    },
    {
      "NAME": "centerBrightness",
      "TYPE": "float",
      "MIN": 0,
      "MAX": 1,
      "DEFAULT": 0.5
    },
    {
      "NAME": "powerCurve",
      "TYPE": "float",
      "MIN": 0,
      "MAX": 4,
      "DEFAULT": 1
    },
    {
      "NAME": "colorize",
      "TYPE": "float",
      "MIN": 0,
      "MAX": 1,
      "DEFAULT": 0
    },
    {
      "NAME": "inverse",
      "TYPE": "bool",
      "DEFAULT": 0
    }
  ]
}
*/




vec3 rgb2hsv(vec3 c)	{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	//vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	//vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
	vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
	
	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)	{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}




void main()
{
	vec4		inColor = IMG_THIS_PIXEL(source);;
	vec4		hslColor;
	vec4		outColor;
	
	//	convert to HSV
	hslColor.rgb = rgb2hsv(inColor.rgb);
	outColor.rgb = hslColor.rgb;
	outColor.a = inColor.a;
	
	//	drop the saturation
	//outColor.g = 0.0;
	
	//	adjust the brightness curve
	outColor.b = pow(outColor.b, powerCurve);
	outColor.b = (outColor.b < centerBrightness) ? (1.0 - outColor.b / centerBrightness) : (outColor.b - centerBrightness) / centerBrightness;
	outColor.b = 1.0 - outColor.b;
	
	outColor.g = outColor.g * (1.0-hslColor.b) * colorize;
	
	//	convert back to rgb
	outColor.rgb = hsv2rgb(outColor.rgb);
	
	gl_FragColor = outColor;
}
