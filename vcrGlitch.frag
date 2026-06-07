#pragma header

// Variables passed from Lua to control the effect intensity over time
uniform float iTime;
uniform bool glitchOn;

// Simple pseudo-random noise function
float noise(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = openfl_TextureCoordv;
    
    if (glitchOn) {
        // Create horizontal line distortions based on time
        float glitchLines = sin(uv.y * 10.0 + iTime * 5.0) * 0.003;
        float noiseFlakes = noise(vec2(uv.y, iTime)) * 0.005;
        
        // Offset the X position of the texture lookup
        uv.x += glitchLines + noiseFlakes;
        
        // Color aberration (separation of Red and Blue channels)
        vec4 redChannel = texture2D(bitmap, vec2(uv.x + 0.002, uv.y));
        vec4 greenChannel = texture2D(bitmap, uv);
        vec4 blueChannel = texture2D(bitmap, vec2(uv.x - 0.002, uv.y));
        
        gl_FragColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, greenChannel.a);
    } else {
        // Output completely normal screen if glitch is turned off
        gl_FragColor = texture2D(bitmap, uv);
    }
}
