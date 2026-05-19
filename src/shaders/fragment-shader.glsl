uniform sampler2D tDiffuse;
uniform sampler2D tAsciiAtlas;
uniform float charactersCount;
uniform vec2 resolution;
uniform float fontSize;
uniform vec2 mousePosition;
uniform float hoverRadius;
uniform vec3 hoverColor;

uniform float waveRadius;
uniform vec2 waveCenter;
uniform float colorState;
uniform float isHovering;

uniform float initWave1Radius;
uniform float initWave2Radius;

varying vec2 vUv;

void main() {
  vec2 cellSize = vec2(fontSize) / resolution;
  vec2 blockCenterUv = floor(vUv / cellSize) * cellSize + (cellSize * 0.5);
  vec2 cellUv = fract(vUv / cellSize);

  vec4 originalColor = texture2D(tDiffuse, blockCenterUv);
  
  float luminance = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));

  float characterIndex = floor(luminance * (charactersCount - 1.0));

  vec2 atlasUv = vec2(
    (characterIndex + cellUv.x) / charactersCount,
    cellUv.y 
  );

  float asciiAlpha = texture2D(tAsciiAtlas, atlasUv).r; 

  vec3 grayBase = originalColor.rgb * 1.8 + 0.2; 
  
  vec2 aspectVec = vec2(resolution.x / resolution.y, 1.0);
  
  vec2 aspectBlockCenter = blockCenterUv * aspectVec;
  vec2 aspectWaveCenter = waveCenter * aspectVec;
  
  float distToWaveCenter = distance(aspectBlockCenter, aspectWaveCenter);
  float waveMask = smoothstep(waveRadius, waveRadius - 0.03, distToWaveCenter);
  
  float effectiveState = mix(1.0 - colorState, colorState, waveMask);
  
  vec3 activeBaseColor = mix(grayBase, hoverColor, effectiveState);
  vec3 activeHoverColor = mix(hoverColor, grayBase, effectiveState);

  vec2 aspectMouse = mousePosition * aspectVec;
  float dist = distance(aspectBlockCenter, aspectMouse);
  float circleMask = smoothstep(hoverRadius, hoverRadius * 0.4, dist) * isHovering;

  vec3 finalColor = mix(activeBaseColor, activeHoverColor, circleMask);
  
  vec2 aspectScreenCenter = vec2(0.5) * aspectVec;
  float distToScreenCenter = distance(aspectBlockCenter, aspectScreenCenter);
  
  float initWave1Mask = smoothstep(initWave1Radius, initWave1Radius - 0.1, distToScreenCenter);
  float initWave2Mask = smoothstep(initWave2Radius, initWave2Radius - 0.1, distToScreenCenter);
  
  vec3 introColor = mix(hoverColor, finalColor, initWave2Mask);
  
  gl_FragColor = vec4(introColor * asciiAlpha, asciiAlpha * originalColor.a * initWave1Mask);
}