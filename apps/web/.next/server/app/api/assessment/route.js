/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/assessment/route";
exports.ids = ["app/api/assessment/route"];
exports.modules = {

/***/ "(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fassessment%2Froute&page=%2Fapi%2Fassessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fassessment%2Froute.ts&appDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fassessment%2Froute&page=%2Fapi%2Fassessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fassessment%2Froute.ts&appDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_app_api_assessment_route_ts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./src/app/api/assessment/route.ts */ \"(rsc)/./src/app/api/assessment/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_app_api_assessment_route_ts__WEBPACK_IMPORTED_MODULE_16__]);\nD_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_app_api_assessment_route_ts__WEBPACK_IMPORTED_MODULE_16__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/assessment/route\",\n        pathname: \"/api/assessment\",\n        filename: \"route\",\n        bundlePath: \"app/api/assessment/route\"\n    },\n    distDir: \".next\" || 0,\n    relativeProjectDir:  false || '',\n    resolvedPagePath: \"D:\\\\Projects\\\\Web Projects\\\\CourseLLM-Firebase\\\\apps\\\\web\\\\src\\\\app\\\\api\\\\assessment\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_app_api_assessment_route_ts__WEBPACK_IMPORTED_MODULE_16__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/assessment/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = false;\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || prerenderManifest.routes[resolvedPathname]);\n    if (isIsr && !isDraftMode) {\n        const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]);\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                cacheComponents: Boolean(nextConfig.experimental.cacheComponents),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        if (!(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL25leHRAMTUuNS43X0BvcGVudGVsZW1ldHJ5K185M2I0ZmUzNjJjM2RhY2RhNzFlMjI0NzM2NmYwNTEzNC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhc3Nlc3NtZW50JTJGcm91dGUmcGFnZT0lMkZhcGklMkZhc3Nlc3NtZW50JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXNzZXNzbWVudCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDUHJvamVjdHMlNUNXZWIlMjBQcm9qZWN0cyU1Q0NvdXJzZUxMTS1GaXJlYmFzZSU1Q2FwcHMlNUN3ZWIlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUQlM0ElNUNQcm9qZWN0cyU1Q1dlYiUyMFByb2plY3RzJTVDQ291cnNlTExNLUZpcmViYXNlJTVDYXBwcyU1Q3dlYiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCZpc0dsb2JhbE5vdEZvdW5kRW5hYmxlZD0hIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2Q7QUFDUztBQUNPO0FBQ0s7QUFDbUM7QUFDakQ7QUFDTztBQUNmO0FBQ3NDO0FBQ3pCO0FBQ007QUFDQztBQUNoQjtBQUN5RDtBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxhQUFhLE9BQW9DLElBQUksQ0FBRTtBQUN2RCx3QkFBd0IsTUFBdUM7QUFDL0Q7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7QUFDbkY7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFxQixFQUFFLEVBRTFCLENBQUM7QUFDTjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsS0FBd0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0pBQW9KO0FBQ2hLLDhCQUE4Qiw2RkFBZ0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDZGQUFlO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDRFQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSw4QkFBOEIsNkVBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDRFQUFlO0FBQzNDLDRCQUE0Qiw2RUFBZ0I7QUFDNUMsb0JBQW9CLHlHQUFrQixrQ0FBa0MsaUhBQXNCO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsZ0ZBQWM7QUFDL0UsK0RBQStELHlDQUF5QztBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRLEVBQUUsTUFBTTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGtCQUFrQjtBQUNsQix1Q0FBdUMsUUFBUSxFQUFFLFFBQVE7QUFDekQ7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLG9CQUFvQjtBQUNuRTtBQUNBLHlCQUF5Qiw2RUFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNGQUF5QjtBQUNqRTtBQUNBLG9DQUFvQyw0RUFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzSkFBc0osb0VBQWM7QUFDcEssMElBQTBJLG9FQUFjO0FBQ3hKO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyw2RUFBZTtBQUNyRDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsOEJBQThCLDZFQUFZO0FBQzFDO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsMkZBQW1CO0FBQ2pFO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0VBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxSUFBcUksNkVBQWU7QUFDcEo7QUFDQSwyR0FBMkcsaUhBQWlIO0FBQzVOO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQiw2RUFBYztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0ZBQTJCO0FBQ3ZELGtCQUFrQiw2RUFBYztBQUNoQywrQkFBK0IsNEVBQXNCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLDBGQUFxQjtBQUNsRTtBQUNBLGtCQUFrQiw2RUFBWTtBQUM5QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw2RUFBNkUsZ0ZBQWM7QUFDM0YsaUNBQWlDLFFBQVEsRUFBRSxRQUFRO0FBQ25ELDBCQUEwQix1RUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU07QUFDTiw2QkFBNkIsNkZBQWU7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkZBQW1CO0FBQ3JEO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLDZFQUFZO0FBQzFCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCB7IGdldFJlcXVlc3RNZXRhIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcmVxdWVzdC1tZXRhXCI7XG5pbXBvcnQgeyBnZXRUcmFjZXIsIFNwYW5LaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3RyYWNlL3RyYWNlclwiO1xuaW1wb3J0IHsgbm9ybWFsaXplQXBwUGF0aCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9yb3V0ZXIvdXRpbHMvYXBwLXBhdGhzXCI7XG5pbXBvcnQgeyBOb2RlTmV4dFJlcXVlc3QsIE5vZGVOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9iYXNlLWh0dHAvbm9kZVwiO1xuaW1wb3J0IHsgTmV4dFJlcXVlc3RBZGFwdGVyLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL3NwZWMtZXh0ZW5zaW9uL2FkYXB0ZXJzL25leHQtcmVxdWVzdFwiO1xuaW1wb3J0IHsgQmFzZVNlcnZlclNwYW4gfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvdHJhY2UvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXZhbGlkYXRlUmVhc29uIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvaW5zdHJ1bWVudGF0aW9uL3V0aWxzXCI7XG5pbXBvcnQgeyBzZW5kUmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9zZW5kLXJlc3BvbnNlXCI7XG5pbXBvcnQgeyBmcm9tTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMsIHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvdXRpbHNcIjtcbmltcG9ydCB7IGdldENhY2hlQ29udHJvbEhlYWRlciB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9jYWNoZS1jb250cm9sXCI7XG5pbXBvcnQgeyBJTkZJTklURV9DQUNIRSwgTkVYVF9DQUNIRV9UQUdTX0hFQURFUiB9IGZyb20gXCJuZXh0L2Rpc3QvbGliL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTm9GYWxsYmFja0Vycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9zaGFyZWQvbGliL25vLWZhbGxiYWNrLWVycm9yLmV4dGVybmFsXCI7XG5pbXBvcnQgeyBDYWNoZWRSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yZXNwb25zZS1jYWNoZVwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFByb2plY3RzXFxcXFdlYiBQcm9qZWN0c1xcXFxDb3Vyc2VMTE0tRmlyZWJhc2VcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXNzZXNzbWVudFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXNzZXNzbWVudC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2Fzc2Vzc21lbnRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2Fzc2Vzc21lbnQvcm91dGVcIlxuICAgIH0sXG4gICAgZGlzdERpcjogcHJvY2Vzcy5lbnYuX19ORVhUX1JFTEFUSVZFX0RJU1RfRElSIHx8ICcnLFxuICAgIHJlbGF0aXZlUHJvamVjdERpcjogcHJvY2Vzcy5lbnYuX19ORVhUX1JFTEFUSVZFX1BST0pFQ1RfRElSIHx8ICcnLFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcUHJvamVjdHNcXFxcV2ViIFByb2plY3RzXFxcXENvdXJzZUxMTS1GaXJlYmFzZVxcXFxhcHBzXFxcXHdlYlxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhc3Nlc3NtZW50XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMsIGN0eCkge1xuICAgIHZhciBfbmV4dENvbmZpZ19leHBlcmltZW50YWw7XG4gICAgbGV0IHNyY1BhZ2UgPSBcIi9hcGkvYXNzZXNzbWVudC9yb3V0ZVwiO1xuICAgIC8vIHR1cmJvcGFjayBkb2Vzbid0IG5vcm1hbGl6ZSBgL2luZGV4YCBpbiB0aGUgcGFnZSBuYW1lXG4gICAgLy8gc28gd2UgbmVlZCB0byB0byBwcm9jZXNzIGR5bmFtaWMgcm91dGVzIHByb3Blcmx5XG4gICAgLy8gVE9ETzogZml4IHR1cmJvcGFjayBwcm92aWRpbmcgZGlmZmVyaW5nIHZhbHVlIGZyb20gd2VicGFja1xuICAgIGlmIChwcm9jZXNzLmVudi5UVVJCT1BBQ0spIHtcbiAgICAgICAgc3JjUGFnZSA9IHNyY1BhZ2UucmVwbGFjZSgvXFwvaW5kZXgkLywgJycpIHx8ICcvJztcbiAgICB9IGVsc2UgaWYgKHNyY1BhZ2UgPT09ICcvaW5kZXgnKSB7XG4gICAgICAgIC8vIHdlIGFsd2F5cyBub3JtYWxpemUgL2luZGV4IHNwZWNpZmljYWxseVxuICAgICAgICBzcmNQYWdlID0gJy8nO1xuICAgIH1cbiAgICBjb25zdCBtdWx0aVpvbmVEcmFmdE1vZGUgPSBwcm9jZXNzLmVudi5fX05FWFRfTVVMVElfWk9ORV9EUkFGVF9NT0RFO1xuICAgIGNvbnN0IHByZXBhcmVSZXN1bHQgPSBhd2FpdCByb3V0ZU1vZHVsZS5wcmVwYXJlKHJlcSwgcmVzLCB7XG4gICAgICAgIHNyY1BhZ2UsXG4gICAgICAgIG11bHRpWm9uZURyYWZ0TW9kZVxuICAgIH0pO1xuICAgIGlmICghcHJlcGFyZVJlc3VsdCkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgcmVzLmVuZCgnQmFkIFJlcXVlc3QnKTtcbiAgICAgICAgY3R4LndhaXRVbnRpbCA9PSBudWxsID8gdm9pZCAwIDogY3R4LndhaXRVbnRpbC5jYWxsKGN0eCwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBidWlsZElkLCBwYXJhbXMsIG5leHRDb25maWcsIGlzRHJhZnRNb2RlLCBwcmVyZW5kZXJNYW5pZmVzdCwgcm91dGVyU2VydmVyQ29udGV4dCwgaXNPbkRlbWFuZFJldmFsaWRhdGUsIHJldmFsaWRhdGVPbmx5R2VuZXJhdGVkLCByZXNvbHZlZFBhdGhuYW1lIH0gPSBwcmVwYXJlUmVzdWx0O1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRTcmNQYWdlID0gbm9ybWFsaXplQXBwUGF0aChzcmNQYWdlKTtcbiAgICBsZXQgaXNJc3IgPSBCb29sZWFuKHByZXJlbmRlck1hbmlmZXN0LmR5bmFtaWNSb3V0ZXNbbm9ybWFsaXplZFNyY1BhZ2VdIHx8IHByZXJlbmRlck1hbmlmZXN0LnJvdXRlc1tyZXNvbHZlZFBhdGhuYW1lXSk7XG4gICAgaWYgKGlzSXNyICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjb25zdCBpc1ByZXJlbmRlcmVkID0gQm9vbGVhbihwcmVyZW5kZXJNYW5pZmVzdC5yb3V0ZXNbcmVzb2x2ZWRQYXRobmFtZV0pO1xuICAgICAgICBjb25zdCBwcmVyZW5kZXJJbmZvID0gcHJlcmVuZGVyTWFuaWZlc3QuZHluYW1pY1JvdXRlc1tub3JtYWxpemVkU3JjUGFnZV07XG4gICAgICAgIGlmIChwcmVyZW5kZXJJbmZvKSB7XG4gICAgICAgICAgICBpZiAocHJlcmVuZGVySW5mby5mYWxsYmFjayA9PT0gZmFsc2UgJiYgIWlzUHJlcmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm9GYWxsYmFja0Vycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNhY2hlS2V5ID0gbnVsbDtcbiAgICBpZiAoaXNJc3IgJiYgIXJvdXRlTW9kdWxlLmlzRGV2ICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjYWNoZUtleSA9IHJlc29sdmVkUGF0aG5hbWU7XG4gICAgICAgIC8vIGVuc3VyZSAvaW5kZXggYW5kIC8gaXMgbm9ybWFsaXplZCB0byBvbmUga2V5XG4gICAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXkgPT09ICcvaW5kZXgnID8gJy8nIDogY2FjaGVLZXk7XG4gICAgfVxuICAgIGNvbnN0IHN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlID0gLy8gSWYgd2UncmUgaW4gZGV2ZWxvcG1lbnQsIHdlIGFsd2F5cyBzdXBwb3J0IGR5bmFtaWMgSFRNTFxuICAgIHJvdXRlTW9kdWxlLmlzRGV2ID09PSB0cnVlIHx8IC8vIElmIHRoaXMgaXMgbm90IFNTRyBvciBkb2VzIG5vdCBoYXZlIHN0YXRpYyBwYXRocywgdGhlbiBpdCBzdXBwb3J0c1xuICAgIC8vIGR5bmFtaWMgSFRNTC5cbiAgICAhaXNJc3I7XG4gICAgLy8gVGhpcyBpcyBhIHJldmFsaWRhdGlvbiByZXF1ZXN0IGlmIHRoZSByZXF1ZXN0IGlzIGZvciBhIHN0YXRpY1xuICAgIC8vIHBhZ2UgYW5kIGl0IGlzIG5vdCBiZWluZyByZXN1bWVkIGZyb20gYSBwb3N0cG9uZWQgcmVuZGVyIGFuZFxuICAgIC8vIGl0IGlzIG5vdCBhIGR5bmFtaWMgUlNDIHJlcXVlc3QgdGhlbiBpdCBpcyBhIHJldmFsaWRhdGlvblxuICAgIC8vIHJlcXVlc3QuXG4gICAgY29uc3QgaXNSZXZhbGlkYXRlID0gaXNJc3IgJiYgIXN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ0dFVCc7XG4gICAgY29uc3QgdHJhY2VyID0gZ2V0VHJhY2VyKCk7XG4gICAgY29uc3QgYWN0aXZlU3BhbiA9IHRyYWNlci5nZXRBY3RpdmVTY29wZVNwYW4oKTtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHByZXJlbmRlck1hbmlmZXN0LFxuICAgICAgICByZW5kZXJPcHRzOiB7XG4gICAgICAgICAgICBleHBlcmltZW50YWw6IHtcbiAgICAgICAgICAgICAgICBjYWNoZUNvbXBvbmVudHM6IEJvb2xlYW4obmV4dENvbmZpZy5leHBlcmltZW50YWwuY2FjaGVDb21wb25lbnRzKSxcbiAgICAgICAgICAgICAgICBhdXRoSW50ZXJydXB0czogQm9vbGVhbihuZXh0Q29uZmlnLmV4cGVyaW1lbnRhbC5hdXRoSW50ZXJydXB0cylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdXBwb3J0c0R5bmFtaWNSZXNwb25zZSxcbiAgICAgICAgICAgIGluY3JlbWVudGFsQ2FjaGU6IGdldFJlcXVlc3RNZXRhKHJlcSwgJ2luY3JlbWVudGFsQ2FjaGUnKSxcbiAgICAgICAgICAgIGNhY2hlTGlmZVByb2ZpbGVzOiAoX25leHRDb25maWdfZXhwZXJpbWVudGFsID0gbmV4dENvbmZpZy5leHBlcmltZW50YWwpID09IG51bGwgPyB2b2lkIDAgOiBfbmV4dENvbmZpZ19leHBlcmltZW50YWwuY2FjaGVMaWZlLFxuICAgICAgICAgICAgaXNSZXZhbGlkYXRlLFxuICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsLFxuICAgICAgICAgICAgb25DbG9zZTogKGNiKT0+e1xuICAgICAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjYik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25BZnRlclRhc2tFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25JbnN0cnVtZW50YXRpb25SZXF1ZXN0RXJyb3I6IChlcnJvciwgX3JlcXVlc3QsIGVycm9yQ29udGV4dCk9PnJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyb3IsIGVycm9yQ29udGV4dCwgcm91dGVyU2VydmVyQ29udGV4dClcbiAgICAgICAgfSxcbiAgICAgICAgc2hhcmVkQ29udGV4dDoge1xuICAgICAgICAgICAgYnVpbGRJZFxuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBub2RlTmV4dFJlcSA9IG5ldyBOb2RlTmV4dFJlcXVlc3QocmVxKTtcbiAgICBjb25zdCBub2RlTmV4dFJlcyA9IG5ldyBOb2RlTmV4dFJlc3BvbnNlKHJlcyk7XG4gICAgY29uc3QgbmV4dFJlcSA9IE5leHRSZXF1ZXN0QWRhcHRlci5mcm9tTm9kZU5leHRSZXF1ZXN0KG5vZGVOZXh0UmVxLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlKHJlcykpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGludm9rZVJvdXRlTW9kdWxlID0gYXN5bmMgKHNwYW4pPT57XG4gICAgICAgICAgICByZXR1cm4gcm91dGVNb2R1bGUuaGFuZGxlKG5leHRSZXEsIGNvbnRleHQpLmZpbmFsbHkoKCk9PntcbiAgICAgICAgICAgICAgICBpZiAoIXNwYW4pIHJldHVybjtcbiAgICAgICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgICAgICAnaHR0cC5zdGF0dXNfY29kZSc6IHJlcy5zdGF0dXNDb2RlLFxuICAgICAgICAgICAgICAgICAgICAnbmV4dC5yc2MnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RTcGFuQXR0cmlidXRlcyA9IHRyYWNlci5nZXRSb290U3BhbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgICAgICAvLyBXZSB3ZXJlIHVuYWJsZSB0byBnZXQgYXR0cmlidXRlcywgcHJvYmFibHkgT1RFTCBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgICAgICAgIGlmICghcm9vdFNwYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJykgIT09IEJhc2VTZXJ2ZXJTcGFuLmhhbmRsZVJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmV4cGVjdGVkIHJvb3Qgc3BhbiB0eXBlICcke3Jvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJyl9Jy4gUGxlYXNlIHJlcG9ydCB0aGlzIE5leHQuanMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL3ZlcmNlbC9uZXh0LmpzYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGUgPSByb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnJvdXRlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgJHttZXRob2R9ICR7cm91dGV9YDtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXh0LnJvdXRlJzogcm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC5yb3V0ZSc6IHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25leHQuc3Bhbl9uYW1lJzogbmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi51cGRhdGVOYW1lKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4udXBkYXRlTmFtZShgJHttZXRob2R9ICR7cmVxLnVybH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlUmVzcG9uc2UgPSBhc3luYyAoY3VycmVudFNwYW4pPT57XG4gICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWU7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUdlbmVyYXRvciA9IGFzeW5jICh7IHByZXZpb3VzQ2FjaGVFbnRyeSB9KT0+e1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSAmJiBpc09uRGVtYW5kUmV2YWxpZGF0ZSAmJiByZXZhbGlkYXRlT25seUdlbmVyYXRlZCAmJiAhcHJldmlvdXNDYWNoZUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9uLWRlbWFuZCByZXZhbGlkYXRlIGFsd2F5cyBzZXRzIHRoaXMgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsICdSRVZBTElEQVRFRCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgnVGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VSb3V0ZU1vZHVsZShjdXJyZW50U3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5mZXRjaE1ldHJpY3MgPSBjb250ZXh0LnJlbmRlck9wdHMuZmV0Y2hNZXRyaWNzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGVuZGluZ1dhaXRVbnRpbCA9IGNvbnRleHQucmVuZGVyT3B0cy5wZW5kaW5nV2FpdFVudGlsO1xuICAgICAgICAgICAgICAgICAgICAvLyBBdHRlbXB0IHVzaW5nIHByb3ZpZGVkIHdhaXRVbnRpbCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQncyBub3Qgd2UgZmFsbGJhY2sgdG8gc2VuZFJlc3BvbnNlJ3MgaGFuZGxpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdXYWl0VW50aWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdHgud2FpdFVudGlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LndhaXRVbnRpbChwZW5kaW5nV2FpdFVudGlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZW5kaW5nV2FpdFVudGlsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlVGFncyA9IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRUYWdzO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCBpcyBmb3IgYSBzdGF0aWMgcmVzcG9uc2UsIHdlIGNhbiBjYWNoZSBpdCBzbyBsb25nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3Mgbm90IGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0lzcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGhlYWRlcnMgZnJvbSB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhyZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW05FWFRfQ0FDSEVfVEFHU19IRUFERVJdID0gY2FjaGVUYWdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzWydjb250ZW50LXR5cGUnXSAmJiBibG9iLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IGJsb2IudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldmFsaWRhdGUgPSB0eXBlb2YgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGUgPT09ICd1bmRlZmluZWQnIHx8IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlID49IElORklOSVRFX0NBQ0hFID8gZmFsc2UgOiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGlyZSA9IHR5cGVvZiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID09PSAndW5kZWZpbmVkJyB8fCBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID49IElORklOSVRFX0NBQ0hFID8gdW5kZWZpbmVkIDogY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY2FjaGUgZW50cnkgZm9yIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlRW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogQ2FjaGVkUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEJ1ZmZlci5mcm9tKGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlQ29udHJvbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIHJlc3BvbnNlIHdpdGhvdXQgY2FjaGluZyBpZiBub3QgSVNSXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCByZXNwb25zZSwgY29udGV4dC5yZW5kZXJPcHRzLnBlbmRpbmdXYWl0VW50aWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGJhY2tncm91bmQgcmV2YWxpZGF0ZSB3ZSBuZWVkIHRvIHJlcG9ydFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVxdWVzdCBlcnJvciBoZXJlIGFzIGl0IHdvbid0IGJlIGJ1YmJsZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogcHJldmlvdXNDYWNoZUVudHJ5LmlzU3RhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ0FwcCBSb3V0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogc3JjUGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcm91dGVyU2VydmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjYWNoZUVudHJ5ID0gYXdhaXQgcm91dGVNb2R1bGUuaGFuZGxlUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBuZXh0Q29uZmlnLFxuICAgICAgICAgICAgICAgIGNhY2hlS2V5LFxuICAgICAgICAgICAgICAgIHJvdXRlS2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICBpc0ZhbGxiYWNrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcmVyZW5kZXJNYW5pZmVzdCxcbiAgICAgICAgICAgICAgICBpc1JvdXRlUFBSRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VHZW5lcmF0b3IsXG4gICAgICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGNyZWF0ZSBhIGNhY2hlRW50cnkgZm9yIElTUlxuICAgICAgICAgICAgaWYgKCFpc0lzcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUgPSBjYWNoZUVudHJ5LnZhbHVlKSA9PSBudWxsID8gdm9pZCAwIDogX2NhY2hlRW50cnlfdmFsdWUua2luZCkgIT09IENhY2hlZFJvdXRlS2luZC5BUFBfUk9VVEUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWUxO1xuICAgICAgICAgICAgICAgIHRocm93IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXcgRXJyb3IoYEludmFyaWFudDogYXBwLXJvdXRlIHJlY2VpdmVkIGludmFsaWQgY2FjaGUgZW50cnkgJHtjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUxID0gY2FjaGVFbnRyeS52YWx1ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jYWNoZUVudHJ5X3ZhbHVlMS5raW5kfWApLCBcIl9fTkVYVF9FUlJPUl9DT0RFXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiRTcwMVwiLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykpIHtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsIGlzT25EZW1hbmRSZXZhbGlkYXRlID8gJ1JFVkFMSURBVEVEJyA6IGNhY2hlRW50cnkuaXNNaXNzID8gJ01JU1MnIDogY2FjaGVFbnRyeS5pc1N0YWxlID8gJ1NUQUxFJyA6ICdISVQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERyYWZ0IG1vZGUgc2hvdWxkIG5ldmVyIGJlIGNhY2hlZFxuICAgICAgICAgICAgaWYgKGlzRHJhZnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICdwcml2YXRlLCBuby1jYWNoZSwgbm8tc3RvcmUsIG1heC1hZ2U9MCwgbXVzdC1yZXZhbGlkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gZnJvbU5vZGVPdXRnb2luZ0h0dHBIZWFkZXJzKGNhY2hlRW50cnkudmFsdWUuaGVhZGVycyk7XG4gICAgICAgICAgICBpZiAoIShnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpICYmIGlzSXNyKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuZGVsZXRlKE5FWFRfQ0FDSEVfVEFHU19IRUFERVIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgY2FjaGUgY29udHJvbCBpcyBhbHJlYWR5IHNldCBvbiB0aGUgcmVzcG9uc2Ugd2UgZG9uJ3RcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlIGl0IHRvIGFsbG93IHVzZXJzIHRvIGN1c3RvbWl6ZSBpdCB2aWEgbmV4dC5jb25maWdcbiAgICAgICAgICAgIGlmIChjYWNoZUVudHJ5LmNhY2hlQ29udHJvbCAmJiAhcmVzLmdldEhlYWRlcignQ2FjaGUtQ29udHJvbCcpICYmICFoZWFkZXJzLmdldCgnQ2FjaGUtQ29udHJvbCcpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCBnZXRDYWNoZUNvbnRyb2xIZWFkZXIoY2FjaGVFbnRyeS5jYWNoZUNvbnRyb2wpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShjYWNoZUVudHJ5LnZhbHVlLmJvZHksIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIHN0YXR1czogY2FjaGVFbnRyeS52YWx1ZS5zdGF0dXMgfHwgMjAwXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVE9ETzogYWN0aXZlU3BhbiBjb2RlIHBhdGggaXMgZm9yIHdoZW4gd3JhcHBlZCBieVxuICAgICAgICAvLyBuZXh0LXNlcnZlciBjYW4gYmUgcmVtb3ZlZCB3aGVuIHRoaXMgaXMgbm8gbG9uZ2VyIHVzZWRcbiAgICAgICAgaWYgKGFjdGl2ZVNwYW4pIHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZVJlc3BvbnNlKGFjdGl2ZVNwYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdHJhY2VyLndpdGhQcm9wYWdhdGVkQ29udGV4dChyZXEuaGVhZGVycywgKCk9PnRyYWNlci50cmFjZShCYXNlU2VydmVyU3Bhbi5oYW5kbGVSZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5OYW1lOiBgJHttZXRob2R9ICR7cmVxLnVybH1gLFxuICAgICAgICAgICAgICAgICAgICBraW5kOiBTcGFuS2luZC5TRVJWRVIsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLm1ldGhvZCc6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLnRhcmdldCc6IHJlcS51cmxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGhhbmRsZVJlc3BvbnNlKSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgTm9GYWxsYmFja0Vycm9yKSkge1xuICAgICAgICAgICAgYXdhaXQgcm91dGVNb2R1bGUub25SZXF1ZXN0RXJyb3IocmVxLCBlcnIsIHtcbiAgICAgICAgICAgICAgICByb3V0ZXJLaW5kOiAnQXBwIFJvdXRlcicsXG4gICAgICAgICAgICAgICAgcm91dGVQYXRoOiBub3JtYWxpemVkU3JjUGFnZSxcbiAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0aHJvdyBzbyB0aGF0IHdlIGNhbiBoYW5kbGUgc2VydmluZyBlcnJvciBwYWdlXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZHVyaW5nIHN0YXRpYyBnZW5lcmF0aW9uLCB0aHJvdyB0aGUgZXJyb3IgYWdhaW4uXG4gICAgICAgIGlmIChpc0lzcikgdGhyb3cgZXJyO1xuICAgICAgICAvLyBPdGhlcndpc2UsIHNlbmQgYSA1MDAgcmVzcG9uc2UuXG4gICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fassessment%2Froute&page=%2Fapi%2Fassessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fassessment%2Froute.ts&appDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22D%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%2C%5B%7B%22id%22%3A%22406af42400bf19d2cd4589640b08d3ebdc98a97350%22%2C%22exportedName%22%3A%22generatePersonalizedAssessment%22%2C%22filename%22%3A%22..%2FD%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%7D%5D%5D%5D&__client_imported__=!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22D%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%2C%5B%7B%22id%22%3A%22406af42400bf19d2cd4589640b08d3ebdc98a97350%22%2C%22exportedName%22%3A%22generatePersonalizedAssessment%22%2C%22filename%22%3A%22..%2FD%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%7D%5D%5D%5D&__client_imported__=! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"406af42400bf19d2cd4589640b08d3ebdc98a97350\": () => (/* reexport safe */ D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_ai_flows_personalized_learning_assessment_ts__WEBPACK_IMPORTED_MODULE_0__.generatePersonalizedAssessment)\n/* harmony export */ });\n/* harmony import */ var D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_ai_flows_personalized_learning_assessment_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/ai/flows/personalized-learning-assessment.ts */ \"(rsc)/./src/ai/flows/personalized-learning-assessment.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([D_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_ai_flows_personalized_learning_assessment_ts__WEBPACK_IMPORTED_MODULE_0__]);\nD_Projects_Web_Projects_CourseLLM_Firebase_apps_web_src_ai_flows_personalized_learning_assessment_ts__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL25leHRAMTUuNS43X0BvcGVudGVsZW1ldHJ5K185M2I0ZmUzNjJjM2RhY2RhNzFlMjI0NzM2NmYwNTEzNC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWZsaWdodC1hY3Rpb24tZW50cnktbG9hZGVyLmpzP2FjdGlvbnM9JTVCJTVCJTIyRCUzQSU1QyU1Q1Byb2plY3RzJTVDJTVDV2ViJTIwUHJvamVjdHMlNUMlNUNDb3Vyc2VMTE0tRmlyZWJhc2UlNUMlNUNhcHBzJTVDJTVDd2ViJTVDJTVDc3JjJTVDJTVDYWklNUMlNUNmbG93cyU1QyU1Q3BlcnNvbmFsaXplZC1sZWFybmluZy1hc3Nlc3NtZW50LnRzJTIyJTJDJTVCJTdCJTIyaWQlMjIlM0ElMjI0MDZhZjQyNDAwYmYxOWQyY2Q0NTg5NjQwYjA4ZDNlYmRjOThhOTczNTAlMjIlMkMlMjJleHBvcnRlZE5hbWUlMjIlM0ElMjJnZW5lcmF0ZVBlcnNvbmFsaXplZEFzc2Vzc21lbnQlMjIlMkMlMjJmaWxlbmFtZSUyMiUzQSUyMi4uJTJGRCUzQSU1QyU1Q1Byb2plY3RzJTVDJTVDV2ViJTIwUHJvamVjdHMlNUMlNUNDb3Vyc2VMTE0tRmlyZWJhc2UlNUMlNUNhcHBzJTVDJTVDd2ViJTVDJTVDc3JjJTVDJTVDYWklNUMlNUNmbG93cyU1QyU1Q3BlcnNvbmFsaXplZC1sZWFybmluZy1hc3Nlc3NtZW50LnRzJTIyJTdEJTVEJTVEJTVEJl9fY2xpZW50X2ltcG9ydGVkX189ISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDK00iLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCB7IGdlbmVyYXRlUGVyc29uYWxpemVkQXNzZXNzbWVudCBhcyBcIjQwNmFmNDI0MDBiZjE5ZDJjZDQ1ODk2NDBiMDhkM2ViZGM5OGE5NzM1MFwiIH0gZnJvbSBcIkQ6XFxcXFByb2plY3RzXFxcXFdlYiBQcm9qZWN0c1xcXFxDb3Vyc2VMTE0tRmlyZWJhc2VcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGFpXFxcXGZsb3dzXFxcXHBlcnNvbmFsaXplZC1sZWFybmluZy1hc3Nlc3NtZW50LnRzXCJcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22D%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%2C%5B%7B%22id%22%3A%22406af42400bf19d2cd4589640b08d3ebdc98a97350%22%2C%22exportedName%22%3A%22generatePersonalizedAssessment%22%2C%22filename%22%3A%22..%2FD%3A%5C%5CProjects%5C%5CWeb%20Projects%5C%5CCourseLLM-Firebase%5C%5Capps%5C%5Cweb%5C%5Csrc%5C%5Cai%5C%5Cflows%5C%5Cpersonalized-learning-assessment.ts%22%7D%5D%5D%5D&__client_imported__=!\n");

/***/ }),

/***/ "(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/ai/flows/personalized-learning-assessment.ts":
/*!**********************************************************!*\
  !*** ./src/ai/flows/personalized-learning-assessment.ts ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generatePersonalizedAssessment: () => (/* binding */ generatePersonalizedAssessment)\n/* harmony export */ });\n/* harmony import */ var private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! private-next-rsc-server-reference */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-encryption */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/server/app-render/encryption.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _ai_genkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/ai/genkit */ \"(rsc)/./src/ai/genkit.ts\");\n/* harmony import */ var genkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! genkit */ \"genkit?d90a\");\n/* harmony import */ var private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! private-next-rsc-action-validate */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_ai_genkit__WEBPACK_IMPORTED_MODULE_2__, genkit__WEBPACK_IMPORTED_MODULE_3__]);\n([_ai_genkit__WEBPACK_IMPORTED_MODULE_2__, genkit__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/* __next_internal_action_entry_do_not_use__ {\"406af42400bf19d2cd4589640b08d3ebdc98a97350\":\"generatePersonalizedAssessment\"} */ \n\n/**\r\n * @fileOverview A personalized learning assessment AI agent.\r\n *\r\n * - generatePersonalizedAssessment - A function that generates a personalized assessment for a student.\r\n * - PersonalizedAssessmentInput - The input type for the generatePersonalizedAssessment function.\r\n * - PersonalizedAssessmentOutput - The return type for the generatePersonalizedAssessment function.\r\n */ \n\nconst PersonalizedAssessmentInputSchema = genkit__WEBPACK_IMPORTED_MODULE_3__.z.object({\n    studentLearningPath: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"The learning path of the student, including topics covered and interactions with course material.\"),\n    courseContent: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"The complete course content, including all materials uploaded by the teacher.\"),\n    studentQuestionsAndAnswers: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"A record of the student's questions and answers during interactions with the course material.\"),\n    learningObjectives: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"The learning objectives defined by the teacher for the course.\")\n});\nconst PersonalizedAssessmentOutputSchema = genkit__WEBPACK_IMPORTED_MODULE_3__.z.object({\n    assessment: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"A personalized assessment for the student, highlighting areas of strength and weakness.\"),\n    suggestedAreasForImprovement: genkit__WEBPACK_IMPORTED_MODULE_3__.z.string().describe(\"Suggested areas for the student to focus on for improvement.\")\n});\nasync function generatePersonalizedAssessment(input) {\n    return personalizedAssessmentFlow(input);\n}\nconst prompt = _ai_genkit__WEBPACK_IMPORTED_MODULE_2__.ai.definePrompt({\n    name: 'personalizedAssessmentPrompt',\n    input: {\n        schema: PersonalizedAssessmentInputSchema\n    },\n    output: {\n        schema: PersonalizedAssessmentOutputSchema\n    },\n    prompt: `You are an expert educational assessment tool.\n\n  Based on the student's learning path, interactions with the course material, questions and answers, and the defined learning objectives, generate a personalized assessment for the student.\n\n  Highlight areas where the student demonstrates strong understanding and areas where they need to focus more attention.\n\n  Provide specific suggestions for improvement based on the student's individual learning path.\n\n  Learning Objectives: {{{learningObjectives}}}\n  Course Content: {{{courseContent}}}\n  Student Learning Path: {{{studentLearningPath}}}\n  Student Questions and Answers: {{{studentQuestionsAndAnswers}}}\n  `,\n    config: {\n        safetySettings: [\n            {\n                category: 'HARM_CATEGORY_HATE_SPEECH',\n                threshold: 'BLOCK_ONLY_HIGH'\n            },\n            {\n                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',\n                threshold: 'BLOCK_NONE'\n            },\n            {\n                category: 'HARM_CATEGORY_HARASSMENT',\n                threshold: 'BLOCK_MEDIUM_AND_ABOVE'\n            },\n            {\n                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',\n                threshold: 'BLOCK_LOW_AND_ABOVE'\n            }\n        ]\n    }\n});\nconst personalizedAssessmentFlow = _ai_genkit__WEBPACK_IMPORTED_MODULE_2__.ai.defineFlow({\n    name: 'personalizedAssessmentFlow',\n    inputSchema: PersonalizedAssessmentInputSchema,\n    outputSchema: PersonalizedAssessmentOutputSchema\n}, async (input)=>{\n    const { output } = await prompt(input);\n    return output;\n});\n\n(0,private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_4__.ensureServerEntryExports)([\n    generatePersonalizedAssessment\n]);\n(0,private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__.registerServerReference)(generatePersonalizedAssessment, \"406af42400bf19d2cd4589640b08d3ebdc98a97350\", null);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYWkvZmxvd3MvcGVyc29uYWxpemVkLWxlYXJuaW5nLWFzc2Vzc21lbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztDQU1DLEdBRThCO0FBQ047QUFFekIsTUFBTUUsb0NBQW9DRCxxQ0FBQ0EsQ0FBQ0UsTUFBTSxDQUFDO0lBQ2pEQyxxQkFBcUJILHFDQUFDQSxDQUNuQkksTUFBTSxHQUNOQyxRQUFRLENBQUM7SUFDWkMsZUFBZU4scUNBQUNBLENBQ2JJLE1BQU0sR0FDTkMsUUFBUSxDQUFDO0lBQ1pFLDRCQUE0QlAscUNBQUNBLENBQzFCSSxNQUFNLEdBQ05DLFFBQVEsQ0FBQztJQUNaRyxvQkFBb0JSLHFDQUFDQSxDQUNsQkksTUFBTSxHQUNOQyxRQUFRLENBQUM7QUFDZDtBQUdBLE1BQU1JLHFDQUFxQ1QscUNBQUNBLENBQUNFLE1BQU0sQ0FBQztJQUNsRFEsWUFBWVYscUNBQUNBLENBQUNJLE1BQU0sR0FBR0MsUUFBUSxDQUFDO0lBQ2hDTSw4QkFBOEJYLHFDQUFDQSxDQUFDSSxNQUFNLEdBQUdDLFFBQVEsQ0FBQztBQUNwRDtBQUdPLGVBQWVPLCtCQUNwQkMsS0FBa0M7SUFFbEMsT0FBT0MsMkJBQTJCRDtBQUNwQztBQUVBLE1BQU1FLFNBQVNoQiwwQ0FBRUEsQ0FBQ2lCLFlBQVksQ0FBQztJQUM3QkMsTUFBTTtJQUNOSixPQUFPO1FBQUNLLFFBQVFqQjtJQUFpQztJQUNqRGtCLFFBQVE7UUFBQ0QsUUFBUVQ7SUFBa0M7SUFDbkRNLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7O0VBWVQsQ0FBQztJQUFDSyxRQUFRO1FBQ1JDLGdCQUFnQjtZQUNkO2dCQUNFQyxVQUFVO2dCQUNWQyxXQUFXO1lBQ2I7WUFDQTtnQkFDRUQsVUFBVTtnQkFDVkMsV0FBVztZQUNiO1lBQ0E7Z0JBQ0VELFVBQVU7Z0JBQ1ZDLFdBQVc7WUFDYjtZQUNBO2dCQUNFRCxVQUFVO2dCQUNWQyxXQUFXO1lBQ2I7U0FDRDtJQUNIO0FBQ0Y7QUFFQSxNQUFNVCw2QkFBNkJmLDBDQUFFQSxDQUFDeUIsVUFBVSxDQUM5QztJQUNFUCxNQUFNO0lBQ05RLGFBQWF4QjtJQUNieUIsY0FBY2pCO0FBQ2hCLEdBQ0EsT0FBTUk7SUFDSixNQUFNLEVBQUNNLE1BQU0sRUFBQyxHQUFHLE1BQU1KLE9BQU9GO0lBQzlCLE9BQU9NO0FBQ1Q7OztJQXJEb0JQOztBQUFBQSwwRkFBQUEsQ0FBQUEiLCJzb3VyY2VzIjpbIkQ6XFxQcm9qZWN0c1xcV2ViIFByb2plY3RzXFxDb3Vyc2VMTE0tRmlyZWJhc2VcXGFwcHNcXHdlYlxcc3JjXFxhaVxcZmxvd3NcXHBlcnNvbmFsaXplZC1sZWFybmluZy1hc3Nlc3NtZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcclxuXHJcbi8qKlxyXG4gKiBAZmlsZU92ZXJ2aWV3IEEgcGVyc29uYWxpemVkIGxlYXJuaW5nIGFzc2Vzc21lbnQgQUkgYWdlbnQuXHJcbiAqXHJcbiAqIC0gZ2VuZXJhdGVQZXJzb25hbGl6ZWRBc3Nlc3NtZW50IC0gQSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBhIHBlcnNvbmFsaXplZCBhc3Nlc3NtZW50IGZvciBhIHN0dWRlbnQuXHJcbiAqIC0gUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0IC0gVGhlIGlucHV0IHR5cGUgZm9yIHRoZSBnZW5lcmF0ZVBlcnNvbmFsaXplZEFzc2Vzc21lbnQgZnVuY3Rpb24uXHJcbiAqIC0gUGVyc29uYWxpemVkQXNzZXNzbWVudE91dHB1dCAtIFRoZSByZXR1cm4gdHlwZSBmb3IgdGhlIGdlbmVyYXRlUGVyc29uYWxpemVkQXNzZXNzbWVudCBmdW5jdGlvbi5cclxuICovXHJcblxyXG5pbXBvcnQge2FpfSBmcm9tICdAL2FpL2dlbmtpdCc7XHJcbmltcG9ydCB7en0gZnJvbSAnZ2Vua2l0JztcclxuXHJcbmNvbnN0IFBlcnNvbmFsaXplZEFzc2Vzc21lbnRJbnB1dFNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBzdHVkZW50TGVhcm5pbmdQYXRoOiB6XHJcbiAgICAuc3RyaW5nKClcclxuICAgIC5kZXNjcmliZShcIlRoZSBsZWFybmluZyBwYXRoIG9mIHRoZSBzdHVkZW50LCBpbmNsdWRpbmcgdG9waWNzIGNvdmVyZWQgYW5kIGludGVyYWN0aW9ucyB3aXRoIGNvdXJzZSBtYXRlcmlhbC5cIiksXHJcbiAgY291cnNlQ29udGVudDogelxyXG4gICAgLnN0cmluZygpXHJcbiAgICAuZGVzY3JpYmUoXCJUaGUgY29tcGxldGUgY291cnNlIGNvbnRlbnQsIGluY2x1ZGluZyBhbGwgbWF0ZXJpYWxzIHVwbG9hZGVkIGJ5IHRoZSB0ZWFjaGVyLlwiKSxcclxuICBzdHVkZW50UXVlc3Rpb25zQW5kQW5zd2VyczogelxyXG4gICAgLnN0cmluZygpXHJcbiAgICAuZGVzY3JpYmUoXCJBIHJlY29yZCBvZiB0aGUgc3R1ZGVudCdzIHF1ZXN0aW9ucyBhbmQgYW5zd2VycyBkdXJpbmcgaW50ZXJhY3Rpb25zIHdpdGggdGhlIGNvdXJzZSBtYXRlcmlhbC5cIiksXHJcbiAgbGVhcm5pbmdPYmplY3RpdmVzOiB6XHJcbiAgICAuc3RyaW5nKClcclxuICAgIC5kZXNjcmliZShcIlRoZSBsZWFybmluZyBvYmplY3RpdmVzIGRlZmluZWQgYnkgdGhlIHRlYWNoZXIgZm9yIHRoZSBjb3Vyc2UuXCIpLFxyXG59KTtcclxuZXhwb3J0IHR5cGUgUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0ID0gei5pbmZlcjx0eXBlb2YgUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0U2NoZW1hPjtcclxuXHJcbmNvbnN0IFBlcnNvbmFsaXplZEFzc2Vzc21lbnRPdXRwdXRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgYXNzZXNzbWVudDogei5zdHJpbmcoKS5kZXNjcmliZShcIkEgcGVyc29uYWxpemVkIGFzc2Vzc21lbnQgZm9yIHRoZSBzdHVkZW50LCBoaWdobGlnaHRpbmcgYXJlYXMgb2Ygc3RyZW5ndGggYW5kIHdlYWtuZXNzLlwiKSxcclxuICBzdWdnZXN0ZWRBcmVhc0ZvckltcHJvdmVtZW50OiB6LnN0cmluZygpLmRlc2NyaWJlKFwiU3VnZ2VzdGVkIGFyZWFzIGZvciB0aGUgc3R1ZGVudCB0byBmb2N1cyBvbiBmb3IgaW1wcm92ZW1lbnQuXCIpLFxyXG59KTtcclxuZXhwb3J0IHR5cGUgUGVyc29uYWxpemVkQXNzZXNzbWVudE91dHB1dCA9IHouaW5mZXI8dHlwZW9mIFBlcnNvbmFsaXplZEFzc2Vzc21lbnRPdXRwdXRTY2hlbWE+O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUGVyc29uYWxpemVkQXNzZXNzbWVudChcclxuICBpbnB1dDogUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0XHJcbik6IFByb21pc2U8UGVyc29uYWxpemVkQXNzZXNzbWVudE91dHB1dD4ge1xyXG4gIHJldHVybiBwZXJzb25hbGl6ZWRBc3Nlc3NtZW50RmxvdyhpbnB1dCk7XHJcbn1cclxuXHJcbmNvbnN0IHByb21wdCA9IGFpLmRlZmluZVByb21wdCh7XHJcbiAgbmFtZTogJ3BlcnNvbmFsaXplZEFzc2Vzc21lbnRQcm9tcHQnLFxyXG4gIGlucHV0OiB7c2NoZW1hOiBQZXJzb25hbGl6ZWRBc3Nlc3NtZW50SW5wdXRTY2hlbWF9LFxyXG4gIG91dHB1dDoge3NjaGVtYTogUGVyc29uYWxpemVkQXNzZXNzbWVudE91dHB1dFNjaGVtYX0sXHJcbiAgcHJvbXB0OiBgWW91IGFyZSBhbiBleHBlcnQgZWR1Y2F0aW9uYWwgYXNzZXNzbWVudCB0b29sLlxyXG5cclxuICBCYXNlZCBvbiB0aGUgc3R1ZGVudCdzIGxlYXJuaW5nIHBhdGgsIGludGVyYWN0aW9ucyB3aXRoIHRoZSBjb3Vyc2UgbWF0ZXJpYWwsIHF1ZXN0aW9ucyBhbmQgYW5zd2VycywgYW5kIHRoZSBkZWZpbmVkIGxlYXJuaW5nIG9iamVjdGl2ZXMsIGdlbmVyYXRlIGEgcGVyc29uYWxpemVkIGFzc2Vzc21lbnQgZm9yIHRoZSBzdHVkZW50LlxyXG5cclxuICBIaWdobGlnaHQgYXJlYXMgd2hlcmUgdGhlIHN0dWRlbnQgZGVtb25zdHJhdGVzIHN0cm9uZyB1bmRlcnN0YW5kaW5nIGFuZCBhcmVhcyB3aGVyZSB0aGV5IG5lZWQgdG8gZm9jdXMgbW9yZSBhdHRlbnRpb24uXHJcblxyXG4gIFByb3ZpZGUgc3BlY2lmaWMgc3VnZ2VzdGlvbnMgZm9yIGltcHJvdmVtZW50IGJhc2VkIG9uIHRoZSBzdHVkZW50J3MgaW5kaXZpZHVhbCBsZWFybmluZyBwYXRoLlxyXG5cclxuICBMZWFybmluZyBPYmplY3RpdmVzOiB7e3tsZWFybmluZ09iamVjdGl2ZXN9fX1cclxuICBDb3Vyc2UgQ29udGVudDoge3t7Y291cnNlQ29udGVudH19fVxyXG4gIFN0dWRlbnQgTGVhcm5pbmcgUGF0aDoge3t7c3R1ZGVudExlYXJuaW5nUGF0aH19fVxyXG4gIFN0dWRlbnQgUXVlc3Rpb25zIGFuZCBBbnN3ZXJzOiB7e3tzdHVkZW50UXVlc3Rpb25zQW5kQW5zd2Vyc319fVxyXG4gIGAsY29uZmlnOiB7XHJcbiAgICBzYWZldHlTZXR0aW5nczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdIQVJNX0NBVEVHT1JZX0hBVEVfU1BFRUNIJyxcclxuICAgICAgICB0aHJlc2hvbGQ6ICdCTE9DS19PTkxZX0hJR0gnLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdIQVJNX0NBVEVHT1JZX0RBTkdFUk9VU19DT05URU5UJyxcclxuICAgICAgICB0aHJlc2hvbGQ6ICdCTE9DS19OT05FJyxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnSEFSTV9DQVRFR09SWV9IQVJBU1NNRU5UJyxcclxuICAgICAgICB0aHJlc2hvbGQ6ICdCTE9DS19NRURJVU1fQU5EX0FCT1ZFJyxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnSEFSTV9DQVRFR09SWV9TRVhVQUxMWV9FWFBMSUNJVCcsXHJcbiAgICAgICAgdGhyZXNob2xkOiAnQkxPQ0tfTE9XX0FORF9BQk9WRScsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgcGVyc29uYWxpemVkQXNzZXNzbWVudEZsb3cgPSBhaS5kZWZpbmVGbG93KFxyXG4gIHtcclxuICAgIG5hbWU6ICdwZXJzb25hbGl6ZWRBc3Nlc3NtZW50RmxvdycsXHJcbiAgICBpbnB1dFNjaGVtYTogUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0U2NoZW1hLFxyXG4gICAgb3V0cHV0U2NoZW1hOiBQZXJzb25hbGl6ZWRBc3Nlc3NtZW50T3V0cHV0U2NoZW1hLFxyXG4gIH0sXHJcbiAgYXN5bmMgaW5wdXQgPT4ge1xyXG4gICAgY29uc3Qge291dHB1dH0gPSBhd2FpdCBwcm9tcHQoaW5wdXQpO1xyXG4gICAgcmV0dXJuIG91dHB1dCE7XHJcbiAgfVxyXG4pO1xyXG4iXSwibmFtZXMiOlsiYWkiLCJ6IiwiUGVyc29uYWxpemVkQXNzZXNzbWVudElucHV0U2NoZW1hIiwib2JqZWN0Iiwic3R1ZGVudExlYXJuaW5nUGF0aCIsInN0cmluZyIsImRlc2NyaWJlIiwiY291cnNlQ29udGVudCIsInN0dWRlbnRRdWVzdGlvbnNBbmRBbnN3ZXJzIiwibGVhcm5pbmdPYmplY3RpdmVzIiwiUGVyc29uYWxpemVkQXNzZXNzbWVudE91dHB1dFNjaGVtYSIsImFzc2Vzc21lbnQiLCJzdWdnZXN0ZWRBcmVhc0ZvckltcHJvdmVtZW50IiwiZ2VuZXJhdGVQZXJzb25hbGl6ZWRBc3Nlc3NtZW50IiwiaW5wdXQiLCJwZXJzb25hbGl6ZWRBc3Nlc3NtZW50RmxvdyIsInByb21wdCIsImRlZmluZVByb21wdCIsIm5hbWUiLCJzY2hlbWEiLCJvdXRwdXQiLCJjb25maWciLCJzYWZldHlTZXR0aW5ncyIsImNhdGVnb3J5IiwidGhyZXNob2xkIiwiZGVmaW5lRmxvdyIsImlucHV0U2NoZW1hIiwib3V0cHV0U2NoZW1hIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/ai/flows/personalized-learning-assessment.ts\n");

/***/ }),

/***/ "(rsc)/./src/ai/genkit.ts":
/*!**************************!*\
  !*** ./src/ai/genkit.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ai: () => (/* binding */ ai)\n/* harmony export */ });\n/* harmony import */ var genkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! genkit */ \"genkit?d90a\");\n/* harmony import */ var _genkit_ai_google_genai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @genkit-ai/google-genai */ \"(rsc)/../../node_modules/.pnpm/@genkit-ai+google-genai@1.2_d19a3daa5b6b7d2acfc8f67be3c6ebb2/node_modules/@genkit-ai/google-genai/lib/index.mjs\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([genkit__WEBPACK_IMPORTED_MODULE_0__]);\ngenkit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst ai = (0,genkit__WEBPACK_IMPORTED_MODULE_0__.genkit)({\n    plugins: [\n        (0,_genkit_ai_google_genai__WEBPACK_IMPORTED_MODULE_1__.googleAI)({\n            apiKey: process.env.GOOGLE_API_KEY\n        })\n    ],\n    model: 'googleai/gemini-2.5-flash'\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYWkvZ2Vua2l0LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFnQztBQUNtQjtBQUU1QyxNQUFNRSxLQUFLRiw4Q0FBTUEsQ0FBQztJQUN2QkcsU0FBUztRQUNQRixpRUFBUUEsQ0FBQztZQUNQRyxRQUFRQyxRQUFRQyxHQUFHLENBQUNDLGNBQWM7UUFDcEM7S0FDRDtJQUNEQyxPQUFPO0FBQ1QsR0FBRyIsInNvdXJjZXMiOlsiRDpcXFByb2plY3RzXFxXZWIgUHJvamVjdHNcXENvdXJzZUxMTS1GaXJlYmFzZVxcYXBwc1xcd2ViXFxzcmNcXGFpXFxnZW5raXQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2Vua2l0IH0gZnJvbSAnZ2Vua2l0JztcclxuaW1wb3J0IHsgZ29vZ2xlQUkgfSBmcm9tICdAZ2Vua2l0LWFpL2dvb2dsZS1nZW5haSc7XHJcblxyXG5leHBvcnQgY29uc3QgYWkgPSBnZW5raXQoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIGdvb2dsZUFJKHtcclxuICAgICAgYXBpS2V5OiBwcm9jZXNzLmVudi5HT09HTEVfQVBJX0tFWSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgbW9kZWw6ICdnb29nbGVhaS9nZW1pbmktMi41LWZsYXNoJyxcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJnZW5raXQiLCJnb29nbGVBSSIsImFpIiwicGx1Z2lucyIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfQVBJX0tFWSIsIm1vZGVsIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/ai/genkit.ts\n");

/***/ }),

/***/ "(rsc)/./src/app/api/assessment/route.ts":
/*!*****************************************!*\
  !*** ./src/app/api/assessment/route.ts ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _ai_flows_personalized_learning_assessment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/ai/flows/personalized-learning-assessment */ \"(rsc)/./src/ai/flows/personalized-learning-assessment.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_ai_flows_personalized_learning_assessment__WEBPACK_IMPORTED_MODULE_1__]);\n_ai_flows_personalized_learning_assessment__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const { studentLearningPath, courseContent, studentQuestionsAndAnswers, learningObjectives } = body;\n        if (!studentLearningPath || !courseContent || !studentQuestionsAndAnswers || !learningObjectives) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        const result = await (0,_ai_flows_personalized_learning_assessment__WEBPACK_IMPORTED_MODULE_1__.generatePersonalizedAssessment)({\n            studentLearningPath,\n            courseContent,\n            studentQuestionsAndAnswers,\n            learningObjectives\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result);\n    } catch (error) {\n        console.error(\"Assessment API error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to generate assessment\"\n        }, {\n            status: 500\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hc3Nlc3NtZW50L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUF3RDtBQUNxQztBQUV0RixlQUFlRSxLQUFLQyxHQUFnQjtJQUN6QyxJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRCxJQUFJRSxJQUFJO1FBQzNCLE1BQU0sRUFBRUMsbUJBQW1CLEVBQUVDLGFBQWEsRUFBRUMsMEJBQTBCLEVBQUVDLGtCQUFrQixFQUFFLEdBQUdMO1FBRS9GLElBQUksQ0FBQ0UsdUJBQXVCLENBQUNDLGlCQUFpQixDQUFDQyw4QkFBOEIsQ0FBQ0Msb0JBQW9CO1lBQ2hHLE9BQU9ULHFEQUFZQSxDQUFDSyxJQUFJLENBQ3RCO2dCQUFFSyxPQUFPO1lBQTBCLEdBQ25DO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNQyxTQUFTLE1BQU1YLDBHQUE4QkEsQ0FBQztZQUNsREs7WUFDQUM7WUFDQUM7WUFDQUM7UUFDRjtRQUVBLE9BQU9ULHFEQUFZQSxDQUFDSyxJQUFJLENBQUNPO0lBQzNCLEVBQUUsT0FBT0YsT0FBTztRQUNkRyxRQUFRSCxLQUFLLENBQUMseUJBQXlCQTtRQUN2QyxPQUFPVixxREFBWUEsQ0FBQ0ssSUFBSSxDQUN0QjtZQUFFSyxPQUFPO1FBQWdDLEdBQ3pDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXFdlYiBQcm9qZWN0c1xcQ291cnNlTExNLUZpcmViYXNlXFxhcHBzXFx3ZWJcXHNyY1xcYXBwXFxhcGlcXGFzc2Vzc21lbnRcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgZ2VuZXJhdGVQZXJzb25hbGl6ZWRBc3Nlc3NtZW50IH0gZnJvbSBcIkAvYWkvZmxvd3MvcGVyc29uYWxpemVkLWxlYXJuaW5nLWFzc2Vzc21lbnRcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgICBjb25zdCB7IHN0dWRlbnRMZWFybmluZ1BhdGgsIGNvdXJzZUNvbnRlbnQsIHN0dWRlbnRRdWVzdGlvbnNBbmRBbnN3ZXJzLCBsZWFybmluZ09iamVjdGl2ZXMgfSA9IGJvZHk7XHJcblxyXG4gICAgaWYgKCFzdHVkZW50TGVhcm5pbmdQYXRoIHx8ICFjb3Vyc2VDb250ZW50IHx8ICFzdHVkZW50UXVlc3Rpb25zQW5kQW5zd2VycyB8fCAhbGVhcm5pbmdPYmplY3RpdmVzKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiBcIk1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZW5lcmF0ZVBlcnNvbmFsaXplZEFzc2Vzc21lbnQoe1xyXG4gICAgICBzdHVkZW50TGVhcm5pbmdQYXRoLFxyXG4gICAgICBjb3Vyc2VDb250ZW50LFxyXG4gICAgICBzdHVkZW50UXVlc3Rpb25zQW5kQW5zd2VycyxcclxuICAgICAgbGVhcm5pbmdPYmplY3RpdmVzLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHJlc3VsdCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJBc3Nlc3NtZW50IEFQSSBlcnJvcjpcIiwgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBnZW5lcmF0ZSBhc3Nlc3NtZW50XCIgfSxcclxuICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2VuZXJhdGVQZXJzb25hbGl6ZWRBc3Nlc3NtZW50IiwiUE9TVCIsInJlcSIsImJvZHkiLCJqc29uIiwic3R1ZGVudExlYXJuaW5nUGF0aCIsImNvdXJzZUNvbnRlbnQiLCJzdHVkZW50UXVlc3Rpb25zQW5kQW5zd2VycyIsImxlYXJuaW5nT2JqZWN0aXZlcyIsImVycm9yIiwic3RhdHVzIiwicmVzdWx0IiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/assessment/route.ts\n");

/***/ }),

/***/ "(ssr)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "./work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "genkit/embedder":
/*!**********************************!*\
  !*** external "genkit/embedder" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/embedder");

/***/ }),

/***/ "genkit/logging":
/*!*********************************!*\
  !*** external "genkit/logging" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/logging");

/***/ }),

/***/ "genkit/model":
/*!*******************************!*\
  !*** external "genkit/model" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/model");

/***/ }),

/***/ "genkit/model/middleware":
/*!******************************************!*\
  !*** external "genkit/model/middleware" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/model/middleware");

/***/ }),

/***/ "genkit/plugin":
/*!********************************!*\
  !*** external "genkit/plugin" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/plugin");

/***/ }),

/***/ "genkit/tracing":
/*!*********************************!*\
  !*** external "genkit/tracing" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit/tracing");

/***/ }),

/***/ "genkit?8a2d":
/*!*************************!*\
  !*** external "genkit" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("genkit");

/***/ }),

/***/ "genkit?d90a":
/*!*************************!*\
  !*** external "genkit" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = import("genkit");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134","vendor-chunks/@opentelemetry+api@1.9.0","vendor-chunks/google-auth-library@9.15.1","vendor-chunks/@genkit-ai+google-genai@1.2_d19a3daa5b6b7d2acfc8f67be3c6ebb2","vendor-chunks/uuid@9.0.1","vendor-chunks/gaxios@6.7.1","vendor-chunks/whatwg-url@5.0.0","vendor-chunks/jws@4.0.0","vendor-chunks/debug@4.4.3","vendor-chunks/json-bigint@1.0.0","vendor-chunks/google-logging-utils@0.0.2","vendor-chunks/tr46@0.0.3","vendor-chunks/https-proxy-agent@7.0.6","vendor-chunks/gcp-metadata@6.1.1","vendor-chunks/ecdsa-sig-formatter@1.0.11","vendor-chunks/agent-base@7.1.4","vendor-chunks/node-fetch@2.7.0","vendor-chunks/webidl-conversions@3.0.1","vendor-chunks/supports-color@7.2.0","vendor-chunks/safe-buffer@5.2.1","vendor-chunks/ms@2.1.3","vendor-chunks/jwa@2.0.1","vendor-chunks/is-stream@2.0.1","vendor-chunks/has-flag@4.0.0","vendor-chunks/gtoken@7.1.0","vendor-chunks/extend@3.0.2","vendor-chunks/buffer-equal-constant-time@1.0.1","vendor-chunks/bignumber.js@9.3.1","vendor-chunks/base64-js@1.5.1"], () => (__webpack_exec__("(rsc)/../../node_modules/.pnpm/next@15.5.7_@opentelemetry+_93b4fe362c3dacda71e2247366f05134/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fassessment%2Froute&page=%2Fapi%2Fassessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fassessment%2Froute.ts&appDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5CWeb%20Projects%5CCourseLLM-Firebase%5Capps%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();