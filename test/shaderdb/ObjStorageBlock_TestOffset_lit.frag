#version 450

struct str
{
    float f;
};

layout(set = 0, binding = 0, std430) buffer BB
{
   layout(offset = 128) vec4 m1;
   layout(offset = 256) str m2;
   layout(offset = 512) vec2 m3;
};

layout(set = 1, binding = 0) uniform Uniforms
{
    vec4 u1;
    float u2;
    vec2 u3;
};

layout(location = 0) out vec4 o1;
layout(location = 1) out float o2;
layout(location = 2) out vec2 o3;

void main()
{
    m1 = u1;
    m2.f = u2;
    m3 = u3;

    o1 = m1;
    o2 = m2.f;
    o3 = m3;
}

// BEGIN_SHADERTEST
/*
; RUN: amdllpc -spvgen-dir=%spvgendir% -v %gfxip %s | FileCheck -check-prefix=SHADERTEST %s

; SHADERTEST-LABEL: {{^// LLPC.*}} SPIR-V lowering results
; SHADERTEST: call void @llpc.buffer.store.v16i8(<4 x i32> %{{[0-9]*}}, i32 128
; SHADERTEST: call void @llpc.buffer.store.v4i8(<4 x i32> %{{[0-9]*}}, i32 256
; SHADERTEST: call void @llpc.buffer.store.v8i8(<4 x i32> %{{[0-9]*}}, i32 512
; SHADERTEST: call <16 x i8> @llpc.buffer.load.v16i8(<4 x i32> %{{[0-9]*}}, i32 128
; SHADERTEST: call <4 x i8> @llpc.buffer.load.v4i8(<4 x i32> %{{[0-9]*}}, i32 256
; SHADERTEST: call <8 x i8> @llpc.buffer.load.v8i8(<4 x i32> %{{[0-9]*}}, i32 512

; SHADERTEST-LABEL: {{^// LLPC.*}} pipeline patching results
; SHADERTEST: call void @llvm.amdgcn.raw.buffer.store.v4f32(<4 x float> %{{.*}}, <4 x i32> %{{[0-9]*}}, i32 128
; SHADERTEST: call void @llvm.amdgcn.raw.buffer.store.f32(float %{{[0-9]*}}, <4 x i32> %{{[0-9]*}}, i32 256
; SHADERTEST: call void @llvm.amdgcn.raw.buffer.store.v2f32(<2 x float> %{{.*}}, <4 x i32> %{{[0-9]*}}, i32 512
; SHADERTEST: call <4 x float> @llvm.amdgcn.raw.buffer.load.v4f32(<4 x i32> %{{[0-9]*}}, i32 128
; SHADERTEST: call float @llvm.amdgcn.raw.buffer.load.f32(<4 x i32> %{{[0-9]*}}, i32 256
; SHADERTEST: call <2 x float> @llvm.amdgcn.raw.buffer.load.v2f32(<4 x i32> %{{[0-9]*}}, i32 512

; SHADERTEST: AMDLLPC SUCCESS
*/
// END_SHADERTEST
