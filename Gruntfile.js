module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      ts: {
          default: {
              tsconfig: './tsconfig.json',
              options: {
                additionalFlags: '--ignoreDeprecations 5.0'
              }
          }
      },
      watch: {
          default: {
              files: ["src/ts/**/*", "src/d.ts/**/*", "index.html", "index.css"],
              tasks: ['ts:default'],
              options: {
                  livereload: true
              }
          }
      },
      connect: {
          server: {
              options: {
                  livereload: true
              }
          }
      },
      clean: {
          all: ["build", "dist", "dist.zip", "js13k.zip"]
      },
      'closure-compiler': {
          es2021: {
              closurePath: 'libbuild/closure-compiler-v20230502',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2021',
                  language_out: 'ECMASCRIPT_2021',
                  externs: 'src/externs/externs.js',
                  create_source_map: "true",
              }
          },
          es5: {
              closurePath: 'libbuild/closure-compiler-v20230502',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2020',
                  language_out: 'ECMASCRIPT5',
                  externs: 'src/externs/externs.js'
              }
          }
      },
      cssmin: {
        options: {
        },
        target: {
            files: {
            'dist/index.css': ['dist/index.css']
            }
        }
      },
      htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'dist/index.html'
          }
        }
      },
      inline: {
          dist: {
              src: 'dist/index.html',
              dest: 'dist/index.html'
          }
      },
      replace: {
          hax: {
            src: ['build/out.js'],
            overwrite: true,
            replacements: [
              // turn on production mode
              {
                from: /ENVIRONMENT = '\w+';/g,
                to: "ENVIRONMENT = 'ultra';"
              },
              // math
              // webgl constants
              { from: "gl.RENDERBUFFER", to: "0x8D41" },
              { from: "gl.FRAMEBUFFER", to: "0x8D40" },
              { from: "gl.DEPTH_COMPONENT16", to: "0x81A5" },
              { from: "gl.DEPTH_ATTACHMENT", to: "0x8D00" },
              { from: "gl.FRAGMENT_SHADER", to: "0x8B30" },
              { from: "gl.ELEMENT_ARRAY_BUFFER", to: "0x8893" },
              { from: "gl.COLOR_ATTACHMENT0", to: "0x8CE0" },
              { from: "gl.DEPTH_TEST", to: "0x0B71" },
              { from: "gl.CULL_FACE", to: "0x0B44" },
              { from: "gl.BLEND", to: "0x0BE2" },
              { from: "gl.LESS", to: "0x0201" },
              { from: "gl.LEQUAL", to: "0x0203" },
              { from: "gl.FRONT", to: "0x0404" },
              { from: "gl.BACK", to: "0x0405" },
              { from: "gl.COLOR_BUFFER_BIT", to: "0x4000" },
              { from: "gl.DEPTH_BUFFER_BIT", to: "0x100" },
              { from: "gl.TEXTURE_2D_ARRAY", to: "0x8C1A" },
              { from: "gl.TEXTURE_2D", to: "0x0DE1" },
              { from: "gl.RGBA", to: "0x1908" },
              { from: "gl.UNSIGNED_SHORT", to: "0x1403" },
              { from: "gl.TRIANGLES", to: "0x0004" },
              { from: "gl.TEXTURE0", to: "0x84C0" },
              { from: "gl.TEXTURE1", to: "0x84C1" },
              { from: "gl.TEXTURE2", to: "0x84C2" },
              { from: "gl.ARRAY_BUFFER", to: "0x8892" },
              { from: "gl.TEXTURE_MAG_FILTER", to: "10240" },
              { from: "gl.NEAREST", to: "9728" },
              { from: "gl.TEXTURE_MIN_FILTER", to: "10241" },
              { from: "gl.SRC_ALPHA", to: "770" },
              { from: "gl.ONE_MINUS_SRC_ALPHA", to: "771" },
              { from: "gl.FLOAT", to: "5126" },
              { from: "gl.STATIC_DRAW", to: "0x88E4" },
              { from: "gl.VERTEX_SHADER", to: "0x8B31" },
              { from: "gl.LINK_STATUS", to: "0x8B82" },
              { from: "gl.CLAMP_TO_EDGE", to: "33071" },
              { from: "gl.DEPTH_COMPONENT", to: "6402" },
              { from: "gl.TEXTURE_3D", to: "32879" },
              { from: "gl.TEXTURE_BASE_LEVEL", to: "33084" },
              { from: "gl.TEXTURE_CUBE_MAP_POSITIVE_X", to: "34069" },
              { from: "gl.TEXTURE_CUBE_MAP", to: "34067" },
              { from: "gl.TEXTURE_MAX_LEVEL", to: "33085" },
              { from: "gl.TEXTURE_WRAP_R", to: "32882" },
              { from: "gl.TEXTURE_WRAP_S", to: "10242" },
              { from: "gl.TEXTURE_WRAP_T", to: "10243" },
              { from: "gl.UNSIGNED_BYTE", to: "5121" }, 
              { from: "gl.LINEAR", to: "9729" },
              // hax GL canvas
              { from: "gl.canvas(", to: "gl['cas'](" }, { from: "gl.drawingBufferWidth(", to: "gl['drBuWh'](" }, { from: "gl.drawingBufferHeight(", to: "gl['drBuHt'](" }, { from: "gl.drawingBufferColorSpace(", to: "gl['drBuCe'](" }, { from: "gl.unpackColorSpace(", to: "gl['unCoSe'](" }, { from: "gl.activeTexture(", to: "gl['acTee'](" }, { from: "gl.attachShader(", to: "gl['atShr'](" }, { from: "gl.beginQuery(", to: "gl['beQuy'](" }, { from: "gl.beginTransformFeedback(", to: "gl['beTrFk'](" }, { from: "gl.bindAttribLocation(", to: "gl['biAtLn'](" }, { from: "gl.bindBufferBase(", to: "gl['biBuBe'](" }, { from: "gl.bindBufferRange(", to: "gl['biBuRe'](" }, { from: "gl.bindRenderbuffer(", to: "gl['biRer'](" }, { from: "gl.bindSampler(", to: "gl['biSar'](" }, { from: "gl.bindTransformFeedback(", to: "gl['biTrFk'](" }, { from: "gl.bindVertexArray(", to: "gl['biVeAy'](" }, { from: "gl.blendColor(", to: "gl['blCor'](" }, { from: "gl.blendEquation(", to: "gl['blEqn'](" }, { from: "gl.blendEquationSeparate(", to: "gl['blEqSe'](" }, { from: "gl.blendFunc(", to: "gl['blFuc'](" }, { from: "gl.blendFuncSeparate(", to: "gl['blFuSe'](" }, { from: "gl.blitFramebuffer(", to: "gl['blFrr'](" }, { from: "gl.bufferData(", to: "gl['buDaa'](" }, { from: "gl.bufferSubData(", to: "gl['buSuDa'](" }, { from: "gl.checkFramebufferStatus(", to: "gl['chFrSs'](" }, { from: "gl.clientWaitSync(", to: "gl['clWaSc'](" }, { from: "gl.compileShader(", to: "gl['coShr'](" }, { from: "gl.compressedTexImage2D(", to: "gl['coTeI2D'](" }, { from: "gl.compressedTexImage3D(", to: "gl['coTeI3D'](" }, { from: "gl.compressedTexSubImage2D(", to: "gl['coTeS2D'](" }, { from: "gl.compressedTexSubImage3D(", to: "gl['coTeS3D'](" }, { from: "gl.copyBufferSubData(", to: "gl['coBuSa'](" }, { from: "gl.createBuffer(", to: "gl['crBur'](" }, { from: "gl.createFramebuffer(", to: "gl['crFrr'](" }, { from: "gl.createProgram(", to: "gl['crPrm'](" }, { from: "gl.createQuery(", to: "gl['crQuy'](" }, { from: "gl.createRenderbuffer(", to: "gl['crRer'](" }, { from: "gl.createSampler(", to: "gl['crSar'](" }, { from: "gl.createShader(", to: "gl['crShr'](" }, { from: "gl.createTexture(", to: "gl['crTee'](" }, { from: "gl.createTransformFeedback(", to: "gl['crTrFk'](" }, { from: "gl.createVertexArray(", to: "gl['crVeAy'](" }, { from: "gl.cullFace(", to: "gl['cuFae'](" }, { from: "gl.deleteBuffer(", to: "gl['deBur'](" }, { from: "gl.deleteFramebuffer(", to: "gl['deFrr'](" }, { from: "gl.deleteProgram(", to: "gl['dePrm'](" }, { from: "gl.deleteQuery(", to: "gl['deQuy'](" }, { from: "gl.deleteRenderbuffer(", to: "gl['deRer'](" }, { from: "gl.deleteSampler(", to: "gl['deSar'](" }, { from: "gl.deleteShader(", to: "gl['deShr'](" }, { from: "gl.deleteSync(", to: "gl['deSyc'](" }, { from: "gl.deleteTexture(", to: "gl['deTee'](" }, { from: "gl.deleteTransformFeedback(", to: "gl['deTrFk'](" }, { from: "gl.deleteVertexArray(", to: "gl['deVeAy'](" }, { from: "gl.depthFunc(", to: "gl['deFuc'](" }, { from: "gl.depthMask(", to: "gl['deMak'](" }, { from: "gl.depthRange(", to: "gl['deRae'](" }, { from: "gl.disable(", to: "gl['die'](" }, { from: "gl.drawArraysInstanced(", to: "gl['drArId'](" }, { from: "gl.drawElementsInstanced(", to: "gl['drElId'](" }, { from: "gl.drawRangeElements(", to: "gl['drRaEs'](" }, { from: "gl.enable(", to: "gl['ene'](" }, { from: "gl.endQuery(", to: "gl['enQuy'](" }, { from: "gl.endTransformFeedback(", to: "gl['enTrFk'](" }, { from: "gl.fenceSync(", to: "gl['feSyc'](" }, { from: "gl.finish(", to: "gl['fih'](" }, { from: "gl.flush(", to: "gl['flh'](" }, { from: "gl.framebufferRenderbuffer(", to: "gl['frRer'](" }, { from: "gl.framebufferTexture2D(", to: "gl['frTe2D'](" }, { from: "gl.framebufferTextureLayer(", to: "gl['frTeLr'](" }, { from: "gl.frontFace(", to: "gl['frFae'](" }, { from: "gl.generateMipmap(", to: "gl['geMip'](" }, { from: "gl.getActiveAttrib(", to: "gl['geAcAb'](" }, { from: "gl.getActiveUniform(", to: "gl['geAcUm'](" }, { from: "gl.getActiveUniformBlockName(", to: "gl['geAcUe'](" }, { from: "gl.getActiveUniformBlockParameter(", to: "gl['geAcUr'](" }, { from: "gl.getActiveUniforms(", to: "gl['geAcUs'](" }, { from: "gl.getAttachedShaders(", to: "gl['geAtSs'](" }, { from: "gl.getAttribLocation(", to: "gl['geAtLn'](" }, { from: "gl.getBufferParameter(", to: "gl['geBuPr'](" }, { from: "gl.getBufferSubData(", to: "gl['geBuSa'](" }, { from: "gl.getContextAttributes(", to: "gl['geCoAs'](" }, { from: "gl.getError(", to: "gl['geErr'](" }, { from: "gl.getExtension(", to: "gl['geExn'](" }, { from: "gl.getFragDataLocation(", to: "gl['geFrDn'](" }, { from: "gl.getFramebufferAttachmentParameter(", to: "gl['geFrAr'](" }, { from: "gl.getIndexedParameter(", to: "gl['geInPr'](" }, { from: "gl.getParameter(", to: "gl['gePar'](" }, { from: "gl.getProgramInfoLog(", to: "gl['gePrIg'](" }, { from: "gl.getProgramParameter(", to: "gl['gePrPr'](" }, { from: "gl.getQuery(", to: "gl['geQuy'](" }, { from: "gl.getQueryParameter(", to: "gl['geQuPr'](" }, { from: "gl.getRenderbufferParameter(", to: "gl['geRePr'](" }, { from: "gl.getSamplerParameter(", to: "gl['geSaPr'](" }, { from: "gl.getShaderInfoLog(", to: "gl['geShIg'](" }, { from: "gl.getShaderParameter(", to: "gl['geShPr'](" }, { from: "gl.getShaderPrecisionFormat(", to: "gl['geShPt'](" }, { from: "gl.getShaderSource(", to: "gl['geShSe'](" }, { from: "gl.getSupportedExtensions(", to: "gl['geSuEs'](" }, { from: "gl.getSyncParameter(", to: "gl['geSyPr'](" }, 
              { from: "gl.getTexParameter(", to: "gl['geTePr'](" }, { from: "gl.getTransformFeedbackVarying(", to: "gl['geTrFg'](" }, { from: "gl.getUniform(", to: "gl['geUnm'](" }, { from: "gl.getUniformBlockIndex(", to: "gl['geUnBx'](" }, { from: "gl.getUniformIndices(", to: "gl['geUnIs'](" }, { from: "gl.getUniformLocation(", to: "gl['geUnLn'](" }, { from: "gl.getVertexAttrib(", to: "gl['geVeAb'](" }, { from: "gl.getVertexAttribOffset(", to: "gl['geVeAt'](" }, { from: "gl.hint(", to: "gl['hit'](" }, { from: "gl.invalidateFramebuffer(", to: "gl['inFrr'](" }, { from: "gl.invalidateSubFramebuffer(", to: "gl['inSuFr'](" }, { from: "gl.isBuffer(", to: "gl['isBur'](" }, { from: "gl.isContextLost(", to: "gl['isCoLt'](" }, { from: "gl.isEnabled(", to: "gl['isEnd'](" }, { from: "gl.isFramebuffer(", to: "gl['isFrr'](" }, { from: "gl.isProgram(", to: "gl['isPrm'](" }, { from: "gl.isQuery(", to: "gl['isQuy'](" }, { from: "gl.isRenderbuffer(", to: "gl['isRer'](" }, { from: "gl.isSampler(", to: "gl['isSar'](" }, { from: "gl.isShader(", to: "gl['isShr'](" }, { from: "gl.isSync(", to: "gl['isSyc'](" }, { from: "gl.isTexture(", to: "gl['isTee'](" }, { from: "gl.isTransformFeedback(", to: "gl['isTrFk'](" }, { from: "gl.isVertexArray(", to: "gl['isVeAy'](" }, { from: "gl.lineWidth(", to: "gl['liWih'](" }, { from: "gl.linkProgram(", to: "gl['liPrm'](" }, { from: "gl.pauseTransformFeedback(", to: "gl['paTrFk'](" }, { from: "gl.pixelStorei(", to: "gl['piSti'](" }, { from: "gl.polygonOffset(", to: "gl['poOft'](" }, { from: "gl.readBuffer(", to: "gl['reBur'](" }, { from: "gl.readPixels(", to: "gl['rePis'](" }, { from: "gl.renderbufferStorage(", to: "gl['reSte'](" }, { from: "gl.renderbufferStorageMultisample(", to: "gl['reStMe'](" }, { from: "gl.resumeTransformFeedback(", to: "gl['reTrFk'](" }, { from: "gl.sampleCoverage(", to: "gl['saCoe'](" }, { from: "gl.samplerParameterf(", to: "gl['saPaf'](" }, { from: "gl.samplerParameteri(", to: "gl['saPai'](" }, { from: "gl.shaderSource(", to: "gl['shSoe'](" }, { from: "gl.stencilFunc(", to: "gl['stFuc'](" }, { from: "gl.stencilFuncSeparate(", to: "gl['stFuSe'](" }, { from: "gl.stencilMask(", to: "gl['stMak'](" }, { from: "gl.stencilMaskSeparate(", to: "gl['stMaSe'](" }, { from: "gl.stencilOp(", to: "gl['stOp'](" }, { from: "gl.stencilOpSeparate(", to: "gl['stOpSe'](" }, { from: "gl.texImage2D(", to: "gl['teIm2D'](" }, { from: "gl.texImage3D(", to: "gl['teIm3D'](" }, { from: "gl.texParameterf(", to: "gl['tePaf'](" }, { from: "gl.texParameteri(", to: "gl['tePai'](" }, { from: "gl.texStorage2D(", to: "gl['teSt2D'](" }, { from: "gl.texStorage3D(", to: "gl['teSt3D'](" }, { from: "gl.texSubImage2D(", to: "gl['teSuI2D'](" }, { from: "gl.texSubImage3D(", to: "gl['teSuI3D'](" }, { from: "gl.transformFeedbackVaryings(", to: "gl['trFeVs'](" }, { from: "gl.uniform1ui(", to: "gl['un1ui'](" }, { from: "gl.uniform2ui(", to: "gl['un2ui'](" }, { from: "gl.uniform3ui(", to: "gl['un3ui'](" }, { from: "gl.uniform4ui(", to: "gl['un4ui'](" }, { from: "gl.uniformBlockBinding(", to: "gl['unBlBg'](" }, { from: "gl.useProgram(", to: "gl['usPrm'](" }, { from: "gl.validateProgram(", to: "gl['vaPrm'](" }, { from: "gl.vertexAttribDivisor(", to: "gl['veAtDr'](" }, { from: "gl.vertexAttribI4i(", to: "gl['veAtI4i'](" }, { from: "gl.vertexAttribI4ui(", to: "gl['veAtI4ui'](" }, { from: "gl.vertexAttribIPointer(", to: "gl['veAtIr'](" }, { from: "gl.waitSync(", to: "gl['waSyc'](" }, { from: "gl.bindBuffer(", to: "gl['biBur'](" }, { from: "gl.bindFramebuffer(", to: "gl['biFrr'](" }, { from: "gl.bindTexture(", to: "gl['biTee'](" }, { from: "gl.clear(", to: "gl['clr'](" }, { from: "gl.clearBufferfi(", to: "gl['clBui'](" }, { from: "gl.clearBufferfv(", to: "gl['clBuv'](" }, { from: "gl.clearColor(", to: "gl['clCor'](" }, { from: "gl.clearDepth(", to: "gl['clDeh'](" }, { from: "gl.clearStencil(", to: "gl['clStl'](" }, { from: "gl.colorMask(", to: "gl['coMak'](" }, { from: "gl.disableVertexAttribArray(", to: "gl['diVeAy'](" }, { from: "gl.drawArrays(", to: "gl['drArs'](" }, { from: "gl.drawBuffers(", to: "gl['drBus'](" }, { from: "gl.drawElements(", to: "gl['drEls'](" }, { from: "gl.enableVertexAttribArray(", to: "gl['enVeAy'](" }, { from: "gl.scissor(", to: "gl['scr'](" }, { from: "gl.uniform1f(", to: "gl['un1f'](" }, { from: "gl.uniform1fv(", to: "gl['un1fv'](" }, { from: "gl.uniform1i(", to: "gl['un1i'](" }, { from: "gl.uniform1iv(", to: "gl['un1iv'](" }, { from: "gl.uniform1uiv(", to: "gl['un1uiv'](" }, { from: "gl.uniform2f(", to: "gl['un2f'](" }, { from: "gl.uniform2fv(", to: "gl['un2fv'](" }, { from: "gl.uniform2i(", to: "gl['un2i'](" }, { from: "gl.uniform2iv(", to: "gl['un2iv'](" }, { from: "gl.uniform2uiv(", to: "gl['un2uiv'](" }, { from: "gl.uniform3f(", to: "gl['un3f'](" }, { from: "gl.uniform3fv(", to: "gl['un3fv'](" }, { from: "gl.uniform3i(", to: "gl['un3i'](" }, { from: "gl.uniform3iv(", to: "gl['un3iv'](" }, { from: "gl.uniform3uiv(", to: "gl['un3uiv'](" }, { from: "gl.uniform4f(", to: "gl['un4f'](" }, { from: "gl.uniform4fv(", to: "gl['un4fv'](" }, { from: "gl.uniform4i(", to: "gl['un4i'](" }, { from: "gl.uniform4iv(", to: "gl['un4iv'](" }, 
              { from: "gl.uniform4uiv(", to: "gl['un4uiv'](" }, { from: "gl.uniformMatrix2fv(", to: "gl['unMa2fv'](" }, { from: "gl.uniformMatrix2x3fv(", to: "gl['unMa2x3fv'](" }, { from: "gl.uniformMatrix2x4fv(", to: "gl['unMa2x4fv'](" }, { from: "gl.uniformMatrix3fv(", to: "gl['unMa3fv'](" }, { from: "gl.uniformMatrix3x2fv(", to: "gl['unMa3x2fv'](" }, { from: "gl.uniformMatrix3x4fv(", to: "gl['unMa3x4fv'](" }, { from: "gl.uniformMatrix4fv(", to: "gl['unMa4fv'](" }, { from: "gl.uniformMatrix4x2fv(", to: "gl['unMa4x2fv'](" }, { from: "gl.uniformMatrix4x3fv(", to: "gl['unMa4x3fv'](" }, { from: "gl.vertexAttrib1f(", to: "gl['veAt1f'](" }, { from: "gl.vertexAttrib1fv(", to: "gl['veAt1fv'](" }, { from: "gl.vertexAttrib2f(", to: "gl['veAt2f'](" }, { from: "gl.vertexAttrib2fv(", to: "gl['veAt2fv'](" }, { from: "gl.vertexAttrib3f(", to: "gl['veAt3f'](" }, { from: "gl.vertexAttrib3fv(", to: "gl['veAt3fv'](" }, { from: "gl.vertexAttrib4f(", to: "gl['veAt4f'](" }, { from: "gl.vertexAttrib4fv(", to: "gl['veAt4fv'](" }, { from: "gl.vertexAttribI4iv(", to: "gl['veAtI4iv'](" }, { from: "gl.vertexAttribI4uiv(", to: "gl['veAtI4uiv'](" }, { from: "gl.vertexAttribPointer(", to: "gl['veAtPr'](" }, { from: "gl.viewport(", to: "gl['vit'](" }, { from: "gl.makeXRCompatible(", to: "gl['maXRe'](" }, 
              // ctx
              { from: "ctx.canvas(", to: "ctx['cas'](" }, { from: "ctx.globalAlpha(", to: "ctx['glAla'](" }, { from: "ctx.globalCompositeOperation(", to: "ctx['glCoOn'](" }, { from: "ctx.filter(", to: "ctx['fir'](" }, { from: "ctx.imageSmoothingEnabled(", to: "ctx['imSmEd'](" }, { from: "ctx.imageSmoothingQuality(", to: "ctx['imSmQy'](" }, { from: "ctx.strokeStyle(", to: "ctx['stSte'](" }, { from: "ctx.fillStyle(", to: "ctx['fiSte'](" }, { from: "ctx.shadowOffsetX(", to: "ctx['shOfX'](" }, { from: "ctx.shadowOffsetY(", to: "ctx['shOfY'](" }, { from: "ctx.shadowBlur(", to: "ctx['shBlr'](" }, { from: "ctx.shadowColor(", to: "ctx['shCor'](" }, { from: "ctx.lineWidth(", to: "ctx['liWih'](" }, { from: "ctx.lineCap(", to: "ctx['liCap'](" }, { from: "ctx.lineJoin(", to: "ctx['liJon'](" }, { from: "ctx.miterLimit(", to: "ctx['miLit'](" }, { from: "ctx.lineDashOffset(", to: "ctx['liDaOt'](" }, { from: "ctx.font(", to: "ctx['fot'](" }, { from: "ctx.textAlign(", to: "ctx['teAln'](" }, { from: "ctx.textBaseline(", to: "ctx['teBae'](" }, { from: "ctx.direction(", to: "ctx['din'](" }, { from: "ctx.fontKerning(", to: "ctx['foKeg'](" }, { from: "ctx.fontStretch(", to: "ctx['foSth'](" }, { from: "ctx.fontVariantCaps(", to: "ctx['foVaCs'](" }, { from: "ctx.letterSpacing(", to: "ctx['leSpg'](" }, { from: "ctx.textRendering(", to: "ctx['teReg'](" }, { from: "ctx.wordSpacing(", to: "ctx['woSpg'](" }, { from: "ctx.clip(", to: "ctx['clp'](" }, { from: "ctx.createConicGradient(", to: "ctx['crCoGt'](" }, { from: "ctx.createImageData(", to: "ctx['crImDa'](" }, { from: "ctx.createLinearGradient(", to: "ctx['crLiGt'](" }, { from: "ctx.createPattern(", to: "ctx['crPan'](" }, { from: "ctx.createRadialGradient(", to: "ctx['crRaGt'](" }, { from: "ctx.drawFocusIfNeeded(", to: "ctx['drFoId'](" }, { from: "ctx.drawImage(", to: "ctx['drIme'](" }, { from: "ctx.fill(", to: "ctx['fil'](" }, { from: "ctx.fillText(", to: "ctx['fiTet'](" }, { from: "ctx.getContextAttributes(", to: "ctx['geCoAs'](" }, { from: "ctx.getImageData(", to: "ctx['geImDa'](" }, { from: "ctx.getLineDash(", to: "ctx['geLiDh'](" }, { from: "ctx.getTransform(", to: "ctx['geTrm'](" }, { from: "ctx.isContextLost(", to: "ctx['isCoLt'](" }, { from: "ctx.isPointInPath(", to: "ctx['isPoIh'](" }, { from: "ctx.isPointInStroke(", to: "ctx['isPoIe'](" }, { from: "ctx.measureText(", to: "ctx['meTet'](" }, { from: "ctx.putImageData(", to: "ctx['puImDa'](" }, { from: "ctx.reset(", to: "ctx['ret'](" }, { from: "ctx.roundRect(", to: "ctx['roRet'](" }, { from: "ctx.save(", to: "ctx['sae'](" }, { from: "ctx.scale(", to: "ctx['sce'](" }, { from: "ctx.setLineDash(", to: "ctx['seLiDh'](" }, { from: "ctx.setTransform(", to: "ctx['seTrm'](" }, { from: "ctx.stroke(", to: "ctx['ste'](" }, { from: "ctx.strokeText(", to: "ctx['stTet'](" }, { from: "ctx.transform(", to: "ctx['trm'](" }, { from: "ctx.translate(", to: "ctx['tre'](" }, { from: "ctx.arcTo(", to: "ctx['arTo'](" }, { from: "ctx.beginPath(", to: "ctx['bePah'](" }, { from: "ctx.bezierCurveTo(", to: "ctx['beCuTo'](" }, { from: "ctx.clearRect(", to: "ctx['clRet'](" }, { from: "ctx.closePath(", to: "ctx['clPah'](" }, { from: "ctx.ellipse(", to: "ctx['ele'](" }, { from: "ctx.fillRect(", to: "ctx['fiRet'](" }, { from: "ctx.lineTo(", to: "ctx['liTo'](" }, { from: "ctx.moveTo(", to: "ctx['moTo'](" }, { from: "ctx.quadraticCurveTo(", to: "ctx['quCuTo'](" }, { from: "ctx.resetTransform(", to: "ctx['reTrm'](" }, { from: "ctx.restore(", to: "ctx['ree'](" }, { from: "ctx.rotate(", to: "ctx['roe'](" }, { from: "ctx.strokeRect(", to: "ctx['stRet'](" }, 
              // main canvas
              { from: "Z.ariaMultiLine(", to: "Z['arMuLe'](" }, { from: "Z.ariaMultiSelectable(", to: "Z['arMuSe'](" }, { from: "Z.ariaOrientation(", to: "Z['arOrn'](" }, { from: "Z.ariaPlaceholder(", to: "Z['arPlr'](" }, { from: "Z.ariaPosInSet(", to: "Z['arPoIt'](" }, { from: "Z.ariaPressed(", to: "Z['arPrd'](" }, { from: "Z.ariaReadOnly(", to: "Z['arReOy'](" }, { from: "Z.ariaRelevant(", to: "Z['arRet'](" }, { from: "Z.ariaRequired(", to: "Z['arRed'](" }, { from: "Z.ariaRoleDescription(", to: "Z['arRoDn'](" }, { from: "Z.ariaRowCount(", to: "Z['arRoCt'](" }, { from: "Z.ariaRowIndex(", to: "Z['arRoIx'](" }, { from: "Z.ariaRowSpan(", to: "Z['arRoSn'](" }, { from: "Z.ariaSelected(", to: "Z['arSed'](" }, { from: "Z.ariaSetSize(", to: "Z['arSeSe'](" }, { from: "Z.ariaSort(", to: "Z['arSot'](" }, { from: "Z.ariaValueMax(", to: "Z['arVaMx'](" }, { from: "Z.ariaValueMin(", to: "Z['arVaMn'](" }, { from: "Z.ariaValueNow(", to: "Z['arVaNw'](" }, { from: "Z.ariaValueText(", to: "Z['arVaTt'](" }, { from: "Z.children(", to: "Z['chn'](" }, { from: "Z.firstElementChild(", to: "Z['fiElCd'](" }, { from: "Z.lastElementChild(", to: "Z['laElCd'](" }, { from: "Z.childElementCount(", to: "Z['chElCt'](" }, { from: "Z.previousElementSibling(", to: "Z['prElSg'](" }, { from: "Z.nextElementSibling(", to: "Z['neElSg'](" }, { from: "Z.after(", to: "Z['afr'](" }, { from: "Z.animate(", to: "Z['ane'](" }, { from: "Z.append(", to: "Z['apd'](" }, { from: "Z.attachShadow(", to: "Z['atShw'](" }, { from: "Z.before(", to: "Z['bee'](" }, { from: "Z.closest(", to: "Z['clt'](" }, { from: "Z.computedStyleMap(", to: "Z['coStMp'](" }, { from: "Z.getAttribute(", to: "Z['geAte'](" }, { from: "Z.getAttributeNS(", to: "Z['geAtNS'](" }, { from: "Z.getAttributeNames(", to: "Z['geAtNs'](" }, { from: "Z.getAttributeNode(", to: "Z['geAtNe'](" }, { from: "Z.getBoundingClientRect(", to: "Z['geBoCt'](" }, { from: "Z.getClientRects(", to: "Z['geClRs'](" }, { from: "Z.getElementsByClassName(", to: "Z['geElBe'](" }, { from: "Z.getElementsByTagNameNS(", to: "Z['geElBS'](" }, { from: "Z.getInnerHTML(", to: "Z['geInHL'](" }, { from: "Z.hasAttribute(", to: "Z['haAte'](" }, { from: "Z.hasAttributeNS(", to: "Z['haAtNS'](" }, { from: "Z.hasAttributes(", to: "Z['haAts'](" }, { from: "Z.hasPointerCapture(", to: "Z['haPoCe'](" }, { from: "Z.insertAdjacentElement(", to: "Z['inAdEt'](" }, { from: "Z.insertAdjacentHTML(", to: "Z['inAdHL'](" }, { from: "Z.insertAdjacentText(", to: "Z['inAdTt'](" }, { from: "Z.matches(", to: "Z['mas'](" }, { from: "Z.prepend(", to: "Z['prd'](" }, { from: "Z.querySelector(", to: "Z['quSer'](" }, { from: "Z.querySelectorAll(", to: "Z['quSeAl'](" }, { from: "Z.releasePointerCapture(", to: "Z['rePoCe'](" }, { from: "Z.remove(", to: "Z['ree'](" }, { from: "Z.removeAttribute(", to: "Z['reAte'](" }, { from: "Z.removeAttributeNS(", to: "Z['reAtNS'](" }, { from: "Z.removeAttributeNode(", to: "Z['reAtNe'](" }, { from: "Z.replaceChildren(", to: "Z['reChn'](" }, { from: "Z.replaceWith(", to: "Z['reWih'](" }, { from: "Z.requestFullscreen(", to: "Z['reFun'](" }, { from: "Z.requestPointerLock(", to: "Z['rePoLk'](" }, { from: "Z.scroll(", to: "Z['scl'](" }, { from: "Z.scrollBy(", to: "Z['scBy'](" }, { from: "Z.scrollIntoView(", to: "Z['scInVw'](" }, { from: "Z.scrollIntoViewIfNeeded(", to: "Z['scInVd'](" }, { from: "Z.scrollTo(", to: "Z['scTo'](" }, { from: "Z.setAttribute(", to: "Z['seAte'](" }, { from: "Z.setAttributeNS(", to: "Z['seAtNS'](" }, { from: "Z.setAttributeNode(", to: "Z['seAtNe'](" }, { from: "Z.setPointerCapture(", to: "Z['sePoCe'](" }, { from: "Z.toggleAttribute(", to: "Z['toAte'](" }, { from: "Z.webkitMatchesSelector(", to: "Z['weMaSr'](" }, { from: "Z.webkitRequestFullScreen(", to: "Z['weReFn'](" }, { from: "Z.checkVisibility(", to: "Z['chViy'](" }, { from: "Z.getAnimations(", to: "Z['geAns'](" }, { from: "Z.setHTML(", to: "Z['seHTL'](" }, { from: "Z.nodeType(", to: "Z['noTye'](" }, { from: "Z.nodeName(", to: "Z['noNae'](" }, { from: "Z.baseURI(", to: "Z['baURI'](" }, { from: "Z.isConnected(", to: "Z['isCod'](" }, { from: "Z.ownerDocument(", to: "Z['owDot'](" }, { from: "Z.parentNode(", to: "Z['paNoe'](" }, { from: "Z.parentElement(", to: "Z['paElt'](" }, { from: "Z.childNodes(", to: "Z['chNos'](" }, { from: "Z.firstChild(", to: "Z['fiChd'](" }, { from: "Z.lastChild(", to: "Z['laChd'](" }, { from: "Z.previousSibling(", to: "Z['prSig'](" }, { from: "Z.nextSibling(", to: "Z['neSig'](" }, { from: "Z.nodeValue(", to: "Z['noVae'](" }, { from: "Z.textContent(", to: "Z['teCot'](" }, { from: "Z.appendChild(", to: "Z['apChd'](" }, { from: "Z.cloneNode(", to: "Z['clNoe'](" }, { from: "Z.compareDocumentPosition(", to: "Z['coDoPn'](" }, { from: "Z.contains(", to: "Z['cos'](" }, { from: "Z.getRootNode(", to: "Z['geRoNe'](" }, { from: "Z.hasChildNodes(", to: "Z['haChNs'](" }, { from: "Z.insertBefore(", to: "Z['inBee'](" }, { from: "Z.isDefaultNamespace(", to: "Z['isDeNe'](" }, { from: "Z.isEqualNode(", to: "Z['isEqNe'](" }, 
              { from: "Z.isSameNode(", to: "Z['isSaNe'](" }, { from: "Z.lookupNamespaceURI(", to: "Z['loNaUI'](" }, { from: "Z.lookupPrefix(", to: "Z['loPrx'](" }, { from: "Z.removeChild(", to: "Z['reChd'](" }, { from: "Z.addEventListener(", to: "Z['adEvLr'](" }, { from: "Z.dispatchEvent(", to: "Z['diEvt'](" }, { from: "Z.removeEventListener(", to: "Z['reEvLr'](" }, 
              // window
              { from: "window.window(", to: "window['wiw'](" }, { from: "window.self(", to: "window['sef'](" }, { from: "window.document(", to: "window['dot'](" }, { from: "window.name(", to: "window['nae'](" }, { from: "window.location(", to: "window['lon'](" }, { from: "window.customElements(", to: "window['cuEls'](" }, { from: "window.history(", to: "window['hiy'](" }, { from: "window.navigation(", to: "window['nan'](" }, { from: "window.locationbar(", to: "window['lor'](" }, { from: "window.menubar(", to: "window['mer'](" }, { from: "window.personalbar(", to: "window['per'](" }, { from: "window.scrollbars(", to: "window['scs'](" }, { from: "window.statusbar(", to: "window['str'](" }, { from: "window.toolbar(", to: "window['tor'](" }, { from: "window.status(", to: "window['sts'](" }, { from: "window.closed(", to: "window['cld'](" }, { from: "window.frames(", to: "window['frs'](" }, { from: "window.length(", to: "window['leh'](" }, { from: "window.opener(", to: "window['opr'](" }, { from: "window.parent(", to: "window['pat'](" }, { from: "window.frameElement(", to: "window['frElt'](" }, { from: "window.navigator(", to: "window['nar'](" }, { from: "window.origin(", to: "window['orn'](" }, { from: "window.external(", to: "window['exl'](" }, { from: "window.screen(", to: "window['scn'](" }, { from: "window.innerWidth(", to: "window['inWih'](" }, { from: "window.innerHeight(", to: "window['inHet'](" }, { from: "window.screenX(", to: "window['scX'](" }, { from: "window.pageXOffset(", to: "window['paXOt'](" }, { from: "window.screenY(", to: "window['scY'](" }, { from: "window.pageYOffset(", to: "window['paYOt'](" }, { from: "window.visualViewport(", to: "window['viVit'](" }, { from: "window.outerWidth(", to: "window['ouWih'](" }, { from: "window.outerHeight(", to: "window['ouHet'](" }, { from: "window.devicePixelRatio(", to: "window['dePiRo'](" }, { from: "window.clientInformation(", to: "window['clInn'](" }, { from: "window.screenLeft(", to: "window['scLet'](" }, { from: "window.screenTop(", to: "window['scTop'](" }, { from: "window.styleMedia(", to: "window['stMea'](" }, { from: "window.onbeforematch(", to: "window['onh'](" }, { from: "window.isSecureContext(", to: "window['isSeCt'](" }, { from: "window.trustedTypes(", to: "window['trTys'](" }, { from: "window.performance(", to: "window['pee'](" }, { from: "window.onscrollend(", to: "window['ond'](" }, { from: "window.onbeforeprint(", to: "window['ont'](" }, { from: "window.crypto(", to: "window['cro'](" }, { from: "window.indexedDB(", to: "window['inDB'](" }, { from: "window.sessionStorage(", to: "window['seSte'](" }, { from: "window.localStorage(", to: "window['loSte'](" }, { from: "window.onmessageerror(", to: "window['onr'](" }, { from: "window.ontransitioncancel(", to: "window['onl'](" }, { from: "window.onplay(", to: "window['ony'](" }, { from: "window.oncontentvisibilityautostatechange(", to: "window['one'](" }, { from: "window.onauxclick(", to: "window['onk'](" }, { from: "window.oncontextmenu(", to: "window['onu'](" }, { from: "window.onwaiting(", to: "window['ong'](" }, { from: "window.onpointerup(", to: "window['onp'](" }, { from: "window.onprogress(", to: "window['ons'](" }, { from: "window.onloadedmetadata(", to: "window['ona'](" }, { from: "window.ondeviceorientation(", to: "window['onn'](" }, { from: "window.onpageshow(", to: "window['onw'](" }, { from: "window.crossOriginIsolated(", to: "window['crOrId'](" }, { from: "window.scheduler(", to: "window['scr'](" }, { from: "window.alert(", to: "window['alt'](" }, { from: "window.atob(", to: "window['atb'](" }, { from: "window.blur(", to: "window['blr'](" }, { from: "window.btoa(", to: "window['bta'](" }, { from: "window.cancelAnimationFrame(", to: "window['caAnFe'](" }, { from: "window.cancelIdleCallback(", to: "window['caIdCk'](" }, { from: "window.captureEvents(", to: "window['caEvs'](" }, { from: "window.clearInterval(", to: "window['clInl'](" }, { from: "window.clearTimeout(", to: "window['clTit'](" }, { from: "window.close(", to: "window['cle'](" }, { from: "window.confirm(", to: "window['com'](" }, { from: "window.createImageBitmap(", to: "window['crImBp'](" }, { from: "window.fetch(", to: "window['feh'](" }, { from: "window.find(", to: "window['fid'](" }, { from: "window.focus(", to: "window['fos'](" }, { from: "window.getComputedStyle(", to: "window['geCoSe'](" }, { from: "window.getSelection(", to: "window['geSen'](" }, { from: "window.matchMedia(", to: "window['maMea'](" }, { from: "window.moveBy(", to: "window['moBy'](" }, { from: "window.moveTo(", to: "window['moTo'](" }, { from: "window.open(", to: "window['opn'](" }, { from: "window.postMessage(", to: "window['poMee'](" }, { from: "window.print(", to: "window['prt'](" }, { from: "window.queueMicrotask(", to: "window['quMik'](" }, { from: "window.releaseEvents(", to: "window['reEvs'](" }, { from: "window.reportError(", to: "window['reErr'](" }, { from: "window.requestAnimationFrame(", to: "window['reAnFe'](" }, { from: "window.requestIdleCallback(", to: "window['reIdCk'](" }, { from: "window.resizeBy(", to: "window['reBy'](" }, { from: "window.resizeTo(", to: "window['reTo'](" }, { from: "window.scroll(", to: "window['scl'](" }, { from: "window.scrollBy(", to: "window['scBy'](" }, { from: "window.scrollTo(", to: "window['scTo'](" }, { from: "window.setInterval(", to: "window['seInl'](" }, { from: "window.setTimeout(", to: "window['seTit'](" }, { from: "window.stop(", to: "window['stp'](" }, { from: "window.structuredClone(", to: "window['stCle'](" }, 
              { from: "window.webkitCancelAnimationFrame(", to: "window['weCaAe'](" }, { from: "window.webkitRequestAnimationFrame(", to: "window['weReAe'](" }, { from: "window.chrome(", to: "window['che'](" }, { from: "window.caches(", to: "window['cas'](" }, { from: "window.cookieStore(", to: "window['coSte'](" }, { from: "window.documentPictureInPicture(", to: "window['doPiIe'](" }, { from: "window.launchQueue(", to: "window['laQue'](" }, { from: "window.getScreenDetails(", to: "window['geScDs'](" }, { from: "window.queryLocalFonts(", to: "window['quLoFs'](" }, { from: "window.showDirectoryPicker(", to: "window['shDiPr'](" }, { from: "window.showOpenFilePicker(", to: "window['shOpFr'](" }, { from: "window.showSaveFilePicker(", to: "window['shSaFr'](" }, { from: "window.originAgentCluster(", to: "window['orAgCr'](" }, { from: "window.credentialless(", to: "window['crs'](" }, { from: "window.speechSynthesis(", to: "window['spSys'](" }, { from: "window.openDatabase(", to: "window['opDae'](" }, { from: "window.webkitRequestFileSystem(", to: "window['weReFm'](" }, { from: "window.webkitResolveLocalFileSystemURL(", to: "window['weReLL'](" }, { from: "window.createAttributeAnimation(", to: "window['crAtAn'](" }, { from: "window.createMatrixUpdate(", to: "window['crMaUe'](" }, { from: "window.createVectorLerpUpdate(", to: "window['crVeLe'](" }, { from: "window.createCompositeAnimation(", to: "window['crCoAn'](" }, { from: "window.createCylinder(", to: "window['crCyr'](" }, { from: "window.decompose(", to: "window['dee'](" }, { from: "window.decomposeShapesToPlanes(", to: "window['deShTs'](" }, { from: "window.calculateLines(", to: "window['caLis'](" }, { from: "window.calculateConvexPerimeter(", to: "window['caCoPr'](" }, { from: "window.decomposeConvexPolygon(", to: "window['deCoPn'](" }, { from: "window.convexPolygonContainsPoint(", to: "window['coPoCt'](" }, { from: "window.dedupePolygon(", to: "window['dePon'](" }, { from: "window.toFace(", to: "window['toFae'](" }, { from: "window.measureFace(", to: "window['meFae'](" }, { from: "window.flipFace(", to: "window['flFae'](" }, { from: "window.toLine(", to: "window['toLie'](" }, { from: "window.toFiniteLine(", to: "window['toFiLe'](" }, { from: "window.lineIntersectsPoints(", to: "window['liInPs'](" }, { from: "window.lineDeltaAndLength(", to: "window['liDeAh'](" }, { from: "window.lineIntersection(", to: "window['liInn'](" }, { from: "window.closestLinePointVector(", to: "window['clLiPr'](" }, { from: "window.toPlane(", to: "window['toPle'](" }, { from: "window.flipPlane(", to: "window['flPle'](" }, { from: "window.planeToTransforms(", to: "window['plToTs'](" }, { from: "window.transformPlane(", to: "window['trPle'](" }, { from: "window.convexShapeContainPoint(", to: "window['coShCt'](" }, { from: "window.convexShapeExpand(", to: "window['coShEd'](" }, { from: "window.transformConvexShape(", to: "window['trCoSe'](" }, { from: "window.rotateToPlane(", to: "window['roToPe'](" }, { from: "window.unrotateFromPlane(", to: "window['unFrPe'](" }, { from: "window.toPoints(", to: "window['toPos'](" }, { from: "window.readInput(", to: "window['reInt'](" }, { from: "window.setKeyState(", to: "window['seKeSe'](" }, { from: "window.someInputUnread(", to: "window['soInUd'](" }, { from: "window.flatMaterial(", to: "window['flMal'](" }, { from: "window.imageDataMaterial(", to: "window['imDaMl'](" }, { from: "window.randomDistributionFactory(", to: "window['raDiFy'](" }, { from: "window.clusteredDistributionFactory(", to: "window['clDiFy'](" }, { from: "window.evenDistributionFactory(", to: "window['evDiFy'](" }, { from: "window.featureMaterial(", to: "window['feMal'](" }, { from: "window.spikeFeatureFactory(", to: "window['spFeFy'](" }, { from: "window.staticFeature(", to: "window['stFee'](" }, { from: "window.riverStonesFeatureFactory(", to: "window['riStFy'](" }, { from: "window.weightedAverageTerrainFactory(", to: "window['weAvTy'](" }, { from: "window.transpose2DArray(", to: "window['tr2DArray'](" }, { from: "window.create2DArray(", to: "window['cr2DArray'](" }, { from: "window.synthesizeOppositeBodyPart(", to: "window['syOpBt'](" }, { from: "window.hasJointAnimation(", to: "window['haJoAn'](" }, { from: "window.setJointAnimations(", to: "window['seJoAs'](" }, { from: "window.synthesizeFromOppositeJointAnimationSequences(", to: "window['syFrOs'](" }, { from: "window.addEventListener(", to: "window['adEvLr'](" }, { from: "window.dispatchEvent(", to: "window['diEvt'](" }, { from: "window.removeEventListener(", to: "window['reEvLr'](" }, 
            ]
          },
          html: {
            src: ['dist/index.html'],
            overwrite: true,
            replacements: [{
              from: /build\/out\.js/g,
              to:"out.min.rr.js"
            }, { // gut the HTML entirely!
              from: "</body></html>",
              to: ""
            }, {
              from: "<html>",
              to: ""
            }, {
              from: "<body>",
              to: ""
            }, {
              from: "<div id=\"fps\"></div>",
              to: ""
            }]
          },
          html2: {
            src: ['dist/index.html'],
            overwrite: true,
            replacements: [{
              from: /id=\"(\w+)\"/g,
              to: "id=$1"
            }, {
              from: /class=\"(\w+)\"/g,
              to: "class=$1"
            }, {
              from: /name=\"(\w+)\"/g,
              to: "name=$1"
            }]
          },          
          js0: {
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [
              // convert from back ticks as regex ignores stuff in backticks?!
              // backticks add bytes apparently
              {
                from: "`",
                to:"\""
              },
            ]
          },
          js00: {
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [
              /* GLSL // comments */ 
              // note if double quotes are used by CC, \n becomes \\n
              {
                from: /\/\/([^\\])*\\n/g,
                to:""
              },              
            ]
          },
          js1: {
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [
              // remove all consts so CC can aggregate consecutive declarations
              { 
                from: /(\s)const(\s)/g, 
                to: "$1let$2"
              },
              // flat(1) is identical to flat
              { 
                from: ".flat(1)", 
                to: ".flat()"
              },
              // forEach can be replaced with map with some performance downside
              { 
                from: ".forEach(", 
                to: ".map("
              },
              {
                from: "'use strict';",
                to:""
              },
              {
                from: "window.",
                to:""
              },
              // GLSL /* */ comments
              // interferes with packing, just don't use this comment style
              // {
              //   from: /\/\*(.|\\n)*\*\//g,
              //   to:""
              // },
              // `${"X"}` -> `X`
              {
                from: /\$\{\"((\w|\d|\.)*)\"\}/g,
                to: "$1"
              },
              // `${-1.2}` -> `-1.2`
              {
                from: /\$\{(\-?(\d|\.)*)\}/g,
                to: "$1"
              },
              {
                from: "void 0",
                to: "null"
              },
              // new lines 
              {
                from: /\\n/g,
                to:" "
              },
              
              // turn consts to lets
              {
                from: "const ",
                to: "let "
              },
              {
                from: "const[",
                to: "let["
              },
              {
                from: "const{",
                to: "let{"
              },
             /*
              {
                from: /(\,|\{)\["(\w+)"\]:/g,
                to: "$1$2:"
              },
              */
              /*
              {
                from: /var ([a-zA-Z_$]+=[^;\{]+);var/g,
                to: "var $1,",
              }
              */
            ]
          },
          js2: { 
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [
              // {
              //   from: /(([^s])\s*(\\n)\s*)+/g,
              //   to:"$2 "
              // },
              // remove duplicate white space characters
              {
                from: /\s+/g,
                to:" "
              },
              // everything back to back ticks
              // {
              //   from: "\"",
              //   to:"`"
              // },
              // GLSL demands a new line here
              {
                from: "#version 300 es",
                to:"#version 300 es\\n"
              },
              // turn lets to vars, black hat, look here if you get weird behaviour
              // {
              //   from: "let ",
              //   to: "var "
              // },
              // {
              //   from: "let{",
              //   to: "var{"
              // },
              // {
              //   from: "let[",
              //   to: "var["
              // },
            // }, {
            //   from: /([^a-zA-Z0-9$])\s(\w)/g,
            //   to: "$1$2"
            // }, {
            //   from: /(\w)\s([^a-zA-Z0-9$])/g,
            //   to: "$1$2"
            // }, {
            //   from: /([^a-zA-Z0-9$])\s([^a-zA-Z0-9$])/g,
            //   to: "$1$2"
            // }, , 
          ]
        },
        js3: { 
          src: ['dist/out.min.js'],
          overwrite: true,
          replacements: [
            // remove spaces after special characters
            {
              from: /\s*(\;|\,|\)|\(|\+|\=|\*|\}|\{|\:|\?|\>|\<|\/)\s*/g,
              to:"$1"
            },
            // remove spaces between minus signs provided it's not followed
            // by another minus sign
            {
              from: /\-\s*([^\-])/g,
              to:"-$1"
            },
            // remove spaces between minus signs provided it's not preceeded
            // by another minus sign
            {
              from: /([^\-])\s*\-/g,
              to:"$1-"
            },

            // null params can just be left off
            {
              from: ",null)",
              to: ")",
            },
            // undefined params can just be left off
            {
              from: ",undefined)",
              to: ")",
            },
            // false (CC turns into !1) can be left off
            {
              from: ",!1)",
              to: ")",
            }
          ]
        }
      },
      copy: {
          html: {
              files: [
                  {expand: true, src: ['index.html'], dest: 'dist/'},
                  {expand: true, src: ['index.css'], dest: 'dist/'}
              ]
          }
      },
      devUpdate: {
          main: {
              options: {
                  //task options go here
                  updateType: 'force',
                  reportUpdated: true
              }
          }
      },
      exec: {
        options: {
          // ...
        },
        roadroller: {
          cmd: 'npx roadroller dist/out.min.js -o dist/out.min.rr.js'
        },
        zip: {
          cmd: 'advzip -4 -a index.zip dist/index.html'
        },
        dir: {
          //cmd: 'stat -c "%N %s" index.zip'
          cmd: 'dir index.zip'
        }
      },
      'gh-pages': {
        options: {
          base: 'dist',
        },
        src: ['index.html']
      }
  });

  // clean
  grunt.loadNpmTasks('grunt-contrib-clean');
  // load the plugin that provides the closure compiler
  grunt.loadNpmTasks('grunt-closure-compiler');
  // Load the plugin that provides the "TS" task.
  grunt.loadNpmTasks('grunt-ts');
  // copy
  grunt.loadNpmTasks('grunt-contrib-copy');
  // replace text in file
  grunt.loadNpmTasks('grunt-text-replace');
  // update version
  grunt.loadNpmTasks('grunt-dev-update');
  // inline js
  grunt.loadNpmTasks('grunt-inline');
  // live reload
  grunt.loadNpmTasks('grunt-contrib-watch');
  // server for live reload
  grunt.loadNpmTasks('grunt-contrib-connect');
  // copying html
  grunt.loadNpmTasks('grunt-contrib-copy');
  // minifying css
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // minifying html
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  // run command line
  grunt.loadNpmTasks('grunt-exec');
  // run command line
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task(s).
  grunt.registerTask('reset', ['clean:all']);
  grunt.registerTask('prod', ['ts']);
  grunt.registerTask('dist', [
    'prod', 
    'replace:hax',
    'closure-compiler:es2021', 
    'copy',
    'cssmin', 
    'replace:html', 
    //'replace:js0',
    'replace:js00',
    'replace:js1',
    'replace:js2',
    'replace:js3',
    'exec:roadroller',
    'inline', 
    'htmlmin',
    'exec:zip',
    'exec:dir',
  ]);
  grunt.registerTask('default', ['prod', 'connect', 'watch']);
  grunt.registerTask('deploy', ['dist', 'gh-pages']);

};
