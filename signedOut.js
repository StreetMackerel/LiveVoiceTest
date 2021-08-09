/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
function Janus(e) {
	function t(e) {
		var t = {
			high: 9e5,
			medium: 3e5,
			low: 1e5
		};
		return e !== undefined && null !== e && (e.high && (t.high = e.high), e.medium && (t.medium = e.medium), e.low && (t.low = e.low)), t
	}

	function n() {
		if (null != ee)
			if (Janus.debug("Long poll..."), Z) {
				var t = B + "/" + ee + "?rid=" + (new Date).getTime();
				G && (t = t + "&maxev=" + G), Q && (t = t + "&token=" + encodeURIComponent(Q)), Y && (t = t + "&apisecret=" + encodeURIComponent(Y)), Janus.httpAPICall(t, {
					verb: "GET",
					withCredentials: V,
					success: i,
					timeout: K,
					error: function (t, i) {
						if (Janus.error(t + ":", i), ++ie > 3) return Z = !1, void e.error("Lost connection to the server (is it down?)");
						//n()
					}
				})
			} else Janus.warn("Is the server down? (connected=false)")
	}

	function i(e, t) {
		if (ie = 0, M || ee === undefined || null === ee || !0 === t || n(), M || !Janus.isArray(e))
			if ("keepalive" !== e.janus)
				if ("ack" !== e.janus)
					if ("success" !== e.janus)
						if ("trickle" === e.janus) {
							if (!(c = e.sender)) return void Janus.warn("Missing sender...");
							if (!(d = te[c])) return void Janus.debug("This handle is not attached to this session");
							var r = e.candidate;
							Janus.debug("Got a trickled candidate on session " + ee), Janus.debug(r);
							var o = d.webrtcStuff;
							o.pc && o.remoteSdp ? (Janus.debug("Adding remote candidate:", r), r && !0 !== r.completed ? o.pc.addIceCandidate(r) : o.pc.addIceCandidate(Janus.endOfCandidates)) : (Janus.debug("We didn't do setRemoteDescription (trickle got here before the offer?), caching candidate"), o.candidates || (o.candidates = []), o.candidates.push(r), Janus.debug(o.candidates))
						} else {
							if ("webrtcup" === e.janus) return Janus.debug("Got a webrtcup event on session " + ee), Janus.debug(e), (c = e.sender) ? (d = te[c]) ? void d.webrtcState(!0) : void Janus.debug("This handle is not attached to this session") : void Janus.warn("Missing sender...");
							if ("hangup" === e.janus) {
								if (Janus.debug("Got a hangup event on session " + ee), Janus.debug(e), !(c = e.sender)) return void Janus.warn("Missing sender...");
								if (!(d = te[c])) return void Janus.debug("This handle is not attached to this session");
								d.webrtcState(!1, e.reason), d.hangup()
							} else if ("detached" === e.janus) {
								if (Janus.debug("Got a detached event on session " + ee), Janus.debug(e), !(c = e.sender)) return void Janus.warn("Missing sender...");
								if (!(d = te[c])) return;
								d.detached = !0, d.ondetached(), d.detach()
							} else if ("media" === e.janus) {
								if (Janus.debug("Got a media event on session " + ee), Janus.debug(e), !(c = e.sender)) return void Janus.warn("Missing sender...");
								if (!(d = te[c])) return void Janus.debug("This handle is not attached to this session");
								d.mediaState(e.type, e.receiving)
							} else if ("slowlink" === e.janus) {
								if (Janus.debug("Got a slowlink event on session " + ee), Janus.debug(e), !(c = e.sender)) return void Janus.warn("Missing sender...");
								if (!(d = te[c])) return void Janus.debug("This handle is not attached to this session");
								d.slowLink(e.uplink, e.lost)
							} else {
								if ("error" === e.janus) {
									var s, a;
									if (Janus.error("Ooops: " + e.error.code + " " + e.error.reason), Janus.debug(e), s = e.transaction)(a = re[s]) && a(e), delete re[s];
									return
								}
								if ("event" === e.janus) {
									var c;
									if (Janus.debug("Got a plugin event on session " + ee), Janus.debug(e), !(c = e.sender)) return void Janus.warn("Missing sender...");
									var l = e.plugindata;
									if (!l) return void Janus.warn("Missing plugindata...");
									Janus.debug("  -- Event is coming from " + c + " (" + l.plugin + ")");
									var d, u = l.data;
									if (Janus.debug(u), !(d = te[c])) return void Janus.warn("This handle is not attached to this session");
									var p = e.jsep;
									p && (Janus.debug("Handling SDP as well..."), Janus.debug(p));
									var f = d.onmessage;
									f ? (Janus.debug("Notifying application..."), f(u, p)) : Janus.debug("No provided notification callback")
								} else {
									if ("timeout" === e.janus) return Janus.error("Timeout on session " + ee), Janus.debug(e), void(M && j.close(3504, "Gateway timeout"));
									Janus.warn("Unknown message/event  '" + e.janus + "' on session " + ee), Janus.debug(e)
								}
							}
						}
		else Janus.debug("Got a success on session " + ee), Janus.debug(e), (s = e.transaction) && ((a = re[s]) && a(e), delete re[s]);
		else Janus.debug("Got an ack on session " + ee), Janus.debug(e), (s = e.transaction) && ((a = re[s]) && a(e), delete re[s]);
		else Janus.vdebug("Got a keepalive on session " + ee);
		else
			for (var h = 0; h < e.length; h++) i(e[h], !0)
	}

	function r() {
		if (B && M && Z) {
			J = setTimeout(r, X);
			var e = {
				janus: "keepalive",
				session_id: ee,
				transaction: Janus.randomString(12)
			};
			Q && (e.token = Q), Y && (e.apisecret = Y), j.send(JSON.stringify(e))
		}
	}

	function o(t) {
		var s = Janus.randomString(12),
			a = {
				janus: "create",
				transaction: s
			};
		if (t.reconnect && (Z = !1, a.janus = "claim", a.session_id = ee, j && (j.onopen = null, j.onerror = null, j.onclose = null, J && (clearTimeout(J), J = null))), Q && (a.token = Q), Y && (a.apisecret = Y), !B && Janus.isArray(H) && (0 === (B = H[F]).indexOf("ws") ? (M = !0, Janus.log("Server #" + (F + 1) + ": trying WebSockets to contact Janus (" + B + ")")) : (M = !1, Janus.log("Server #" + (F + 1) + ": trying REST API to contact Janus (" + B + ")"))), M)
			for (var c in j = Janus.newWebSocket(B, "janus-protocol"), N = {
					error: function () {
						if (Janus.error("Error connecting to the Janus WebSockets server... " + B), Janus.isArray(H) && !t.reconnect) return ++F === H.length ? void t.error("Error connecting to any of the provided Janus servers: Is the server down?") : (B = null, void setTimeout(function () {
							o(t)
						}, 200));
						t.error("Error connecting to the Janus WebSockets server: Is the server down?")
					},
					open: function () {
						re[s] = function (e) {
							if (Janus.debug(e), "success" !== e.janus) return Janus.error("Ooops: " + e.error.code + " " + e.error.reason), void t.error(e.error.reason);
							J = setTimeout(r, X), Z = !0, ee = e.session_id ? e.session_id : e.data.id, t.reconnect ? Janus.log("Claimed session: " + ee) : Janus.log("Created session: " + ee), Janus.sessions[ee] = ne, t.success()
						}, j.send(JSON.stringify(a))
					},
					message: function (e) {
						i(JSON.parse(e.data))
					},
					close: function () {
						B && Z && (Z = !1, e.error("Lost connection to the server (is it down?)"))
					}
				}) j.addEventListener(c, N[c]);
		else Janus.httpAPICall(B, {
			verb: "POST",
			withCredentials: V,
			body: a,
			success: function (e) {
				if (Janus.debug(e), "success" !== e.janus) return Janus.error("Ooops: " + e.error.code + " " + e.error.reason), void t.error(e.error.reason);
				Z = !0, ee = e.session_id ? e.session_id : e.data.id, t.reconnect ? Janus.log("Claimed session: " + ee) : Janus.log("Created session: " + ee), Janus.sessions[ee] = ne, n(), t.success()
			},
			error: function (e, n) {
				if (Janus.error(e + ":", n), Janus.isArray(H) && !t.reconnect) return ++F === H.length ? void t.error("Error connecting to any of the provided Janus servers: Is the server down?") : (B = null, void setTimeout(function () {
					o(t)
				}, 200));
				"" === n ? t.error(e + ": Is the server down?") : t.error(e + ": " + n)
			}
		})
	}

	function s(t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop;
		var n = !0 === t.unload,
			i = !0;
		t.notifyDestroyed !== undefined && null !== t.notifyDestroyed && (i = !0 === t.notifyDestroyed);
		var r = !0 === t.cleanupHandles;
		if (Janus.log("Destroying session " + ee + " (unload=" + n + ")"), !ee) return Janus.warn("No session to destroy"), t.success(), void(i && e.destroyed());
		if (r)
			for (var o in te) f(o, {
				noRequest: !0
			});
		if (!Z) return Janus.warn("Is the server down? (connected=false)"), ee = null, void t.success();
		var s = {
			janus: "destroy",
			transaction: Janus.randomString(12)
		};
		if (Q && (s.token = Q), Y && (s.apisecret = Y), n) return M ? (j.onclose = null, j.close(), j = null) : navigator.sendBeacon(B + "/" + ee, JSON.stringify(s)), Janus.log("Destroyed session:"), ee = null, Z = !1, t.success(), void(i && e.destroyed());
		if (M) {
			s.session_id = ee;
			var a = function () {
					for (var e in N) j.removeEventListener(e, N[e]);
					j.removeEventListener("message", c), j.removeEventListener("error", l), J && clearTimeout(J), j.close()
				},
				c = function (n) {
					var r = JSON.parse(n.data);
					r.session_id == s.session_id && r.transaction == s.transaction && (a(), t.success(), i && e.destroyed())
				},
				l = function () {
					a(), t.error("Failed to destroy the server: Is the server down?"), i && e.destroyed()
				};
			return j.addEventListener("message", c), j.addEventListener("error", l), void j.send(JSON.stringify(s))
		}
		Janus.httpAPICall(B + "/" + ee, {
			verb: "POST",
			withCredentials: V,
			body: s,
			success: function (n) {
				Janus.log("Destroyed session:"), Janus.debug(n), ee = null, Z = !1, "success" !== n.janus && Janus.error("Ooops: " + n.error.code + " " + n.error.reason), t.success(), i && e.destroyed()
			},
			error: function (n, r) {
				Janus.error(n + ":", r), ee = null, Z = !1, t.success(), i && e.destroyed()
			}
		})
	}

	function a(e) {
		if ((e = e || {}).success = "function" == typeof e.success ? e.success : Janus.noop, e.error = "function" == typeof e.error ? e.error : Janus.noop, e.consentDialog = "function" == typeof e.consentDialog ? e.consentDialog : Janus.noop, e.iceState = "function" == typeof e.iceState ? e.iceState : Janus.noop, e.mediaState = "function" == typeof e.mediaState ? e.mediaState : Janus.noop, e.webrtcState = "function" == typeof e.webrtcState ? e.webrtcState : Janus.noop, e.slowLink = "function" == typeof e.slowLink ? e.slowLink : Janus.noop, e.onmessage = "function" == typeof e.onmessage ? e.onmessage : Janus.noop, e.onlocalstream = "function" == typeof e.onlocalstream ? e.onlocalstream : Janus.noop, e.onremotestream = "function" == typeof e.onremotestream ? e.onremotestream : Janus.noop, e.ondata = "function" == typeof e.ondata ? e.ondata : Janus.noop, e.ondataopen = "function" == typeof e.ondataopen ? e.ondataopen : Janus.noop, e.oncleanup = "function" == typeof e.oncleanup ? e.oncleanup : Janus.noop, e.ondetached = "function" == typeof e.ondetached ? e.ondetached : Janus.noop, !Z) return Janus.warn("Is the server down? (connected=false)"), void e.error("Is the server down? (connected=false)");
		var t = e.plugin;
		if (!t) return Janus.error("Invalid plugin"), void e.error("Invalid plugin");
		var n = e.opaqueId,
			i = e.token ? e.token : Q,
			r = Janus.randomString(12),
			o = {
				janus: "attach",
				plugin: t,
				opaque_id: n,
				transaction: r
			};
		if (i && (o.token = i), Y && (o.apisecret = Y), M) return re[r] = function (n) {
			if (Janus.debug(n), "success" !== n.janus) return Janus.error("Ooops: " + n.error.code + " " + n.error.reason), void e.error("Ooops: " + n.error.code + " " + n.error.reason);
			var r = n.data.id;
			Janus.log("Created handle: " + r);
			var o = {
				session: ne,
				plugin: t,
				id: r,
				token: i,
				detached: !1,
				webrtcStuff: {
					started: !1,
					myStream: null,
					streamExternal: !1,
					remoteStream: null,
					mySdp: null,
					mediaConstraints: null,
					pc: null,
					dataChannel: {},
					dtmfSender: null,
					trickle: !0,
					iceDone: !1,
					volume: {
						value: null,
						timer: null
					},
					bitrate: {
						value: null,
						bsnow: null,
						bsbefore: null,
						tsnow: null,
						tsbefore: null,
						timer: null
					}
				},
				getId: function () {
					return r
				},
				getPlugin: function () {
					return t
				},
				getVolume: function () {
					return b(r, !0)
				},
				getRemoteVolume: function () {
					return b(r, !0)
				},
				getLocalVolume: function () {
					return b(r, !1)
				},
				isAudioMuted: function () {
					return w(r, !1)
				},
				muteAudio: function () {
					return S(r, !1, !0)
				},
				unmuteAudio: function () {
					return S(r, !1, !1)
				},
				isVideoMuted: function () {
					return w(r, !0)
				},
				muteVideo: function () {
					return S(r, !0, !0)
				},
				unmuteVideo: function () {
					return S(r, !0, !1)
				},
				getBitrate: function () {
					return C(r)
				},
				send: function (e) {
					c(r, e)
				},
				data: function (e) {
					u(r, e)
				},
				dtmf: function (e) {
					p(r, e)
				},
				consentDialog: e.consentDialog,
				iceState: e.iceState,
				mediaState: e.mediaState,
				webrtcState: e.webrtcState,
				slowLink: e.slowLink,
				onmessage: e.onmessage,
				createOffer: function (e) {
					m(r, !0, e)
				},
				createAnswer: function (e) {
					m(r, !1, e)
				},
				handleRemoteJsep: function (e) {
					g(r, e)
				},
				onlocalstream: e.onlocalstream,
				onremotestream: e.onremotestream,
				ondata: e.ondata,
				ondataopen: e.ondataopen,
				oncleanup: e.oncleanup,
				ondetached: e.ondetached,
				hangup: function (e) {
					x(r, !0 === e)
				},
				detach: function (e) {
					f(r, e)
				}
			};
			te[r] = o, e.success(o)
		}, o.session_id = ee, void j.send(JSON.stringify(o));
		Janus.httpAPICall(B + "/" + ee, {
			verb: "POST",
			withCredentials: V,
			body: o,
			success: function (n) {
				if (Janus.debug(n), "success" !== n.janus) return Janus.error("Ooops: " + n.error.code + " " + n.error.reason), void e.error("Ooops: " + n.error.code + " " + n.error.reason);
				var r = n.data.id;
				Janus.log("Created handle: " + r);
				var o = {
					session: ne,
					plugin: t,
					id: r,
					token: i,
					detached: !1,
					webrtcStuff: {
						started: !1,
						myStream: null,
						streamExternal: !1,
						remoteStream: null,
						mySdp: null,
						mediaConstraints: null,
						pc: null,
						dataChannel: {},
						dtmfSender: null,
						trickle: !0,
						iceDone: !1,
						volume: {
							value: null,
							timer: null
						},
						bitrate: {
							value: null,
							bsnow: null,
							bsbefore: null,
							tsnow: null,
							tsbefore: null,
							timer: null
						}
					},
					getId: function () {
						return r
					},
					getPlugin: function () {
						return t
					},
					getVolume: function () {
						return b(r, !0)
					},
					getRemoteVolume: function () {
						return b(r, !0)
					},
					getLocalVolume: function () {
						return b(r, !1)
					},
					isAudioMuted: function () {
						return w(r, !1)
					},
					muteAudio: function () {
						return S(r, !1, !0)
					},
					unmuteAudio: function () {
						return S(r, !1, !1)
					},
					isVideoMuted: function () {
						return w(r, !0)
					},
					muteVideo: function () {
						return S(r, !0, !0)
					},
					unmuteVideo: function () {
						return S(r, !0, !1)
					},
					getBitrate: function () {
						return C(r)
					},
					send: function (e) {
						c(r, e)
					},
					data: function (e) {
						u(r, e)
					},
					dtmf: function (e) {
						p(r, e)
					},
					consentDialog: e.consentDialog,
					iceState: e.iceState,
					mediaState: e.mediaState,
					webrtcState: e.webrtcState,
					slowLink: e.slowLink,
					onmessage: e.onmessage,
					createOffer: function (e) {
						m(r, !0, e)
					},
					createAnswer: function (e) {
						m(r, !1, e)
					},
					handleRemoteJsep: function (e) {
						g(r, e)
					},
					onlocalstream: e.onlocalstream,
					onremotestream: e.onremotestream,
					ondata: e.ondata,
					ondataopen: e.ondataopen,
					oncleanup: e.oncleanup,
					ondetached: e.ondetached,
					hangup: function (e) {
						x(r, !0 === e)
					},
					detach: function (e) {
						f(r, e)
					}
				};
				te[r] = o, e.success(o)
			},
			error: function (t, n) {
				Janus.error(t + ":", n), "" === n ? e.error(t + ": Is the server down?") : e.error(t + ": " + n)
			}
		})
	}

	function c(e, t) {
		if ((t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop, !Z) return Janus.warn("Is the server down? (connected=false)"), void t.error("Is the server down? (connected=false)");
		var n = te[e];
		if (!n || !n.webrtcStuff) return Janus.warn("Invalid handle"), void t.error("Invalid handle");
		var i = t.message,
			r = t.jsep,
			o = Janus.randomString(12),
			s = {
				janus: "message",
				body: i,
				transaction: o
			};
		if (n.token && (s.token = n.token), Y && (s.apisecret = Y), r && (s.jsep = {
				type: r.type,
				sdp: r.sdp
			}, r.e2ee && (s.jsep.e2ee = !0)), Janus.debug("Sending message to plugin (handle=" + e + "):"), Janus.debug(s), M) return s.session_id = ee, s.handle_id = e, re[o] = function (e) {
			if (Janus.debug("Message sent!"), Janus.debug(e), "success" === e.janus) {
				var n = e.plugindata;
				if (!n) return Janus.warn("Request succeeded, but missing plugindata..."), void t.success();
				Janus.log("Synchronous transaction successful (" + n.plugin + ")");
				var i = n.data;
				return Janus.debug(i), void t.success(i)
			}
			"ack" === e.janus ? t.success() : e.error ? (Janus.error("Ooops: " + e.error.code + " " + e.error.reason), t.error(e.error.code + " " + e.error.reason)) : (Janus.error("Unknown error"), t.error("Unknown error"))
		}, void j.send(JSON.stringify(s));
		Janus.httpAPICall(B + "/" + ee + "/" + e, {
			verb: "POST",
			withCredentials: V,
			body: s,
			success: function (e) {
				if (Janus.debug("Message sent!"), Janus.debug(e), "success" === e.janus) {
					var n = e.plugindata;
					if (!n) return Janus.warn("Request succeeded, but missing plugindata..."), void t.success();
					Janus.log("Synchronous transaction successful (" + n.plugin + ")");
					var i = n.data;
					return Janus.debug(i), void t.success(i)
				}
				"ack" === e.janus ? t.success() : e.error ? (Janus.error("Ooops: " + e.error.code + " " + e.error.reason), t.error(e.error.code + " " + e.error.reason)) : (Janus.error("Unknown error"), t.error("Unknown error"))
			},
			error: function (e, n) {
				Janus.error(e + ":", n), t.error(e + ": " + n)
			}
		})
	}

	function l(e, t) {
		if (Z) {
			var n = te[e];
			if (n && n.webrtcStuff) {
				var i = {
					janus: "trickle",
					candidate: t,
					transaction: Janus.randomString(12)
				};
				if (n.token && (i.token = n.token), Y && (i.apisecret = Y), Janus.vdebug("Sending trickle candidate (handle=" + e + "):"), Janus.vdebug(i), M) return i.session_id = ee, i.handle_id = e, void j.send(JSON.stringify(i));
				Janus.httpAPICall(B + "/" + ee + "/" + e, {
					verb: "POST",
					withCredentials: V,
					body: i,
					success: function (e) {
						Janus.vdebug("Candidate sent!"), Janus.vdebug(e), "ack" === e.janus || Janus.error("Ooops: " + e.error.code + " " + e.error.reason)
					},
					error: function (e, t) {
						Janus.error(e + ":", t)
					}
				})
			} else Janus.warn("Invalid handle")
		} else Janus.warn("Is the server down? (connected=false)")
	}

	function d(e, t, n, i, r) {
		var o = te[e];
		if (o && o.webrtcStuff) {
			var s = o.webrtcStuff,
				a = function (e) {
					Janus.log("Received message on data channel:", e);
					var t = e.target.label;
					o.ondata(e.data, t)
				},
				c = function (e) {
					Janus.log("Received state change on data channel:", e);
					var t = e.target.label,
						n = e.target.protocol,
						i = s.dataChannel[t] ? s.dataChannel[t].readyState : "null";
					if (Janus.log("State change on <" + t + "> data channel: " + i), "open" === i) {
						if (s.dataChannel[t].pending && s.dataChannel[t].pending.length > 0) {
							for (var r of (Janus.log("Sending pending messages on <" + t + ">:", s.dataChannel[t].pending.length), s.dataChannel[t].pending)) Janus.log("Sending data on data channel <" + t + ">"), Janus.debug(r), s.dataChannel[t].send(r);
							s.dataChannel[t].pending = []
						}
						o.ondataopen(t, n)
					}
				},
				l = function (e) {
					Janus.error("Got error on data channel:", e)
				};
			if (i) s.dataChannel[t] = i;
			else {
				var d = {
					ordered: !0
				};
				n && (d.protocol = n), s.dataChannel[t] = s.pc.createDataChannel(t, d)
			}
			s.dataChannel[t].onmessage = a, s.dataChannel[t].onopen = c, s.dataChannel[t].onclose = c, s.dataChannel[t].onerror = l, s.dataChannel[t].pending = [], r && s.dataChannel[t].pending.push(r)
		} else Janus.warn("Invalid handle")
	}

	function u(e, t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop;
		var n = te[e];
		if (!n || !n.webrtcStuff) return Janus.warn("Invalid handle"), void t.error("Invalid handle");
		var i = n.webrtcStuff,
			r = t.text || t.data;
		if (!r) return Janus.warn("Invalid data"), void t.error("Invalid data");
		var o = t.label ? t.label : Janus.dataChanDefaultLabel;
		return i.dataChannel[o] ? "open" !== i.dataChannel[o].readyState ? (i.dataChannel[o].pending.push(r), void t.success()) : (Janus.log("Sending data on data channel <" + o + ">"), Janus.debug(r), i.dataChannel[o].send(r), void t.success()) : (d(e, o, t.protocol, !1, r, t.protocol), void t.success())
	}

	function p(e, t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop;
		var n = te[e];
		if (!n || !n.webrtcStuff) return Janus.warn("Invalid handle"), void t.error("Invalid handle");
		var i = n.webrtcStuff;
		if (!i.dtmfSender) {
			if (i.pc) {
				var r = i.pc.getSenders().find(function (e) {
					return e.track && "audio" === e.track.kind
				});
				if (!r) return Janus.warn("Invalid DTMF configuration (no audio track)"), void t.error("Invalid DTMF configuration (no audio track)");
				i.dtmfSender = r.dtmf, i.dtmfSender && (Janus.log("Created DTMF Sender"), i.dtmfSender.ontonechange = function (e) {
					Janus.debug("Sent DTMF tone: " + e.tone)
				})
			}
			if (!i.dtmfSender) return Janus.warn("Invalid DTMF configuration"), void t.error("Invalid DTMF configuration")
		}
		var o = t.dtmf;
		if (!o) return Janus.warn("Invalid DTMF parameters"), void t.error("Invalid DTMF parameters");
		var s = o.tones;
		if (!s) return Janus.warn("Invalid DTMF string"), void t.error("Invalid DTMF string");
		var a = "number" == typeof o.duration ? o.duration : 500,
			c = "number" == typeof o.gap ? o.gap : 50;
		Janus.debug("Sending DTMF string " + s + " (duration " + a + "ms, gap " + c + "ms)"), i.dtmfSender.insertDTMF(s, a, c), t.success()
	}

	function f(e, t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop;
		var n = !0 === t.noRequest;
		Janus.log("Destroying handle " + e + " (only-locally=" + n + ")"), x(e);
		var i = te[e];
		if (!i || i.detached) return delete te[e], void t.success();
		if (n) return delete te[e], void t.success();
		if (!Z) return Janus.warn("Is the server down? (connected=false)"), void t.error("Is the server down? (connected=false)");
		var r = {
			janus: "detach",
			transaction: Janus.randomString(12)
		};
		if (i.token && (r.token = i.token), Y && (r.apisecret = Y), M) return r.session_id = ee, r.handle_id = e, j.send(JSON.stringify(r)), delete te[e], void t.success();
		Janus.httpAPICall(B + "/" + ee + "/" + e, {
			verb: "POST",
			withCredentials: V,
			body: r,
			success: function (n) {
				Janus.log("Destroyed handle:"), Janus.debug(n), "success" !== n.janus && Janus.error("Ooops: " + n.error.code + " " + n.error.reason), delete te[e], t.success()
			},
			error: function (n, i) {
				Janus.error(n + ":", i), delete te[e], t.success()
			}
		})
	}

	function h(e, n, i, r, o) {
		var s = te[e];
		if (!s || !s.webrtcStuff) return Janus.warn("Invalid handle"), void r.error("Invalid handle");
		var a = s.webrtcStuff;
		Janus.debug("streamsDone:", o), o && (Janus.debug("  -- Audio tracks:", o.getAudioTracks()), Janus.debug("  -- Video tracks:", o.getVideoTracks()));
		var c = !1;
		if (a.myStream && i.update && !a.streamExternal) {
			if ((!i.update && _(i) || i.update && (i.addAudio || i.replaceAudio)) && o.getAudioTracks() && o.getAudioTracks().length)
				if (a.myStream.addTrack(o.getAudioTracks()[0]), Janus.unifiedPlan) {
					Janus.log((i.replaceAudio ? "Replacing" : "Adding") + " audio track:", o.getAudioTracks()[0]);
					var u = null;
					if ((f = a.pc.getTransceivers()) && f.length > 0)
						for (var p of f)
							if (p.sender && p.sender.track && "audio" === p.sender.track.kind || p.receiver && p.receiver.track && "audio" === p.receiver.track.kind) {
								u = p;
								break
							} u && u.sender ? u.sender.replaceTrack(o.getAudioTracks()[0]) : a.pc.addTrack(o.getAudioTracks()[0], o)
				} else Janus.log((i.replaceAudio ? "Replacing" : "Adding") + " audio track:", o.getAudioTracks()[0]), a.pc.addTrack(o.getAudioTracks()[0], o);
			if ((!i.update && D(i) || i.update && (i.addVideo || i.replaceVideo)) && o.getVideoTracks() && o.getVideoTracks().length)
				if (a.myStream.addTrack(o.getVideoTracks()[0]), Janus.unifiedPlan) {
					Janus.log((i.replaceVideo ? "Replacing" : "Adding") + " video track:", o.getVideoTracks()[0]);
					var f, h = null;
					if ((f = a.pc.getTransceivers()) && f.length > 0)
						for (var p of f)
							if (p.sender && p.sender.track && "video" === p.sender.track.kind || p.receiver && p.receiver.track && "video" === p.receiver.track.kind) {
								h = p;
								break
							} h && h.sender ? h.sender.replaceTrack(o.getVideoTracks()[0]) : a.pc.addTrack(o.getVideoTracks()[0], o)
				} else Janus.log((i.replaceVideo ? "Replacing" : "Adding") + " video track:", o.getVideoTracks()[0]), a.pc.addTrack(o.getVideoTracks()[0], o)
		} else a.myStream = o, c = !0;
		if (!a.pc) {
			var m = {
				iceServers: q,
				iceTransportPolicy: z,
				bundlePolicy: W
			};
			"chrome" === Janus.webRTCAdapter.browserDetails.browser && (m.sdpSemantics = Janus.webRTCAdapter.browserDetails.version < 72 ? "plan-b" : "unified-plan");
			var g = {
				optional: [{
					DtlsSrtpKeyAgreement: !0
				}]
			};
			if (U && g.optional.push({
					googIPv6: !0
				}), r.rtcConstraints && "object" == typeof r.rtcConstraints)
				for (var b in Janus.debug("Adding custom PeerConnection constraints:", r.rtcConstraints), r.rtcConstraints) g.optional.push(r.rtcConstraints[b]);
			"edge" === Janus.webRTCAdapter.browserDetails.browser && (m.bundlePolicy = "max-bundle"), RTCRtpSender.prototype.createEncodedAudioStreams && RTCRtpSender.prototype.createEncodedVideoStreams && (r.senderTransforms || r.receiverTransforms) && (a.senderTransforms = r.senderTransforms, a.receiverTransforms = r.receiverTransforms, m.forceEncodedAudioInsertableStreams = !0, m.forceEncodedVideoInsertableStreams = !0, m.encodedInsertableStreams = !0), Janus.log("Creating PeerConnection"), Janus.debug(g), a.pc = new RTCPeerConnection(m, g), Janus.debug(a.pc), a.pc.getStats && (a.volume = {}, a.bitrate.value = "0 kbits/sec"), Janus.log("Preparing local SDP and gathering candidates (trickle=" + a.trickle + ")"), a.pc.oniceconnectionstatechange = function () {
				a.pc && s.iceState(a.pc.iceConnectionState)
			}, a.pc.onicecandidate = function (t) {
				if (!t.candidate || "edge" === Janus.webRTCAdapter.browserDetails.browser && t.candidate.candidate.indexOf("endOfCandidates") > 0) Janus.log("End of candidates."), a.iceDone = !0, !0 === a.trickle ? l(e, {
					completed: !0
				}) : A(e, r);
				else {
					var n = {
						candidate: t.candidate.candidate,
						sdpMid: t.candidate.sdpMid,
						sdpMLineIndex: t.candidate.sdpMLineIndex
					};
					!0 === a.trickle && l(e, n)
				}
			}, a.pc.ontrack = function (e) {
				if (Janus.log("Handling Remote Track"), Janus.debug(e), e.streams && (a.remoteStream = e.streams[0], s.onremotestream(a.remoteStream), !e.track.onended)) {
					if (a.receiverTransforms) {
						var t = null;
						"audio" === e.track.kind && a.receiverTransforms.audio ? t = e.receiver.createEncodedAudioStreams() : "video" === e.track.kind && a.receiverTransforms.video && (t = e.receiver.createEncodedVideoStreams()), t && t.readableStream.pipeThrough(a.receiverTransforms[e.track.kind]).pipeTo(t.writableStream)
					}
					var n = null;
					Janus.log("Adding onended callback to track:", e.track), e.track.onended = function (e) {
						Janus.log("Remote track removed:", e), a.remoteStream && (clearTimeout(n), a.remoteStream.removeTrack(e.target), s.onremotestream(a.remoteStream))
					}, e.track.onmute = function (e) {
						Janus.log("Remote track muted:", e), a.remoteStream && null == n && (n = setTimeout(function () {
							Janus.log("Removing remote track"), a.remoteStream && (a.remoteStream.removeTrack(e.target), s.onremotestream(a.remoteStream)), n = null
						}, 2520))
					}, e.track.onunmute = function (e) {
						if (Janus.log("Remote track flowing again:", e), null != n) clearTimeout(n), n = null;
						else try {
							a.remoteStream.addTrack(e.target), s.onremotestream(a.remoteStream)
						} catch (t) {
							Janus.error(t)
						}
					}
				}
			}
		}
		if (c && o) {
			Janus.log("Adding local stream");
			var w = !0 === r.simulcast2;
			o.getTracks().forEach(function (e) {
				if (Janus.log("Adding local track:", e), w)
					if ("audio" === e.kind) a.pc.addTrack(e, o);
					else {
						Janus.log("Enabling rid-based simulcasting:", e);
						var n = t(r.simulcastMaxBitrates);
						a.pc.addTransceiver(e, {
							direction: "sendrecv",
							streams: [o],
							sendEncodings: [{
								rid: "h",
								active: !0,
								maxBitrate: n.high
							}, {
								rid: "m",
								active: !0,
								maxBitrate: n.medium,
								scaleResolutionDownBy: 2
							}, {
								rid: "l",
								active: !0,
								maxBitrate: n.low,
								scaleResolutionDownBy: 4
							}]
						})
					}
				else {
					var i = a.pc.addTrack(e, o);
					if (i && a.senderTransforms) {
						var s = null;
						"audio" === i.track.kind && a.senderTransforms.audio ? s = i.createEncodedAudioStreams() : "video" === i.track.kind && a.senderTransforms.video && (s = i.createEncodedVideoStreams()), s && s.readableStream.pipeThrough(a.senderTransforms[i.track.kind]).pipeTo(s.writableStream)
					}
				}
			})
		}
		O(i) && !a.dataChannel[Janus.dataChanDefaultLabel] && (Janus.log("Creating default data channel"), d(e, Janus.dataChanDefaultLabel, null, !1), a.pc.ondatachannel = function (t) {
			Janus.log("Data channel created by Janus:", t), d(e, t.channel.label, t.channel.protocol, t.channel)
		}), a.myStream && s.onlocalstream(a.myStream), n ? a.pc.setRemoteDescription(n).then(function () {
			if (Janus.log("Remote description accepted!"), a.remoteSdp = n.sdp, a.candidates && a.candidates.length > 0) {
				for (var t = 0; t < a.candidates.length; t++) {
					var o = a.candidates[t];
					Janus.debug("Adding remote candidate:", o), o && !0 !== o.completed ? a.pc.addIceCandidate(o) : a.pc.addIceCandidate(Janus.endOfCandidates)
				}
				a.candidates = []
			}
			y(e, i, r)
		}, r.error) : v(e, i, r)
	}

	function m(e, t, n) {
		(n = n || {}).success = "function" == typeof n.success ? n.success : Janus.noop, n.error = "function" == typeof n.error ? n.error : T;
		var i = n.jsep;
		if (t && i) return Janus.error("Provided a JSEP to a createOffer"), void n.error("Provided a JSEP to a createOffer");
		if (!(t || i && i.type && i.sdp)) return Janus.error("A valid JSEP is required for createAnswer"), void n.error("A valid JSEP is required for createAnswer");
		n.media = "object" == typeof n.media && n.media ? n.media : {
			audio: !0,
			video: !0
		};
		var r = n.media,
			o = te[e];
		if (!o || !o.webrtcStuff) return Janus.warn("Invalid handle"), void n.error("Invalid handle");
		var s = o.webrtcStuff;
		if (s.trickle = L(n.trickle), s.pc) {
			if (Janus.log("Updating existing media session"), r.update = !0, n.stream) n.stream !== s.myStream && Janus.log("Renegotiation involves a new external stream");
			else {
				if (r.addAudio) {
					if (r.keepAudio = !1, r.replaceAudio = !1, r.removeAudio = !1, r.audioSend = !0, s.myStream && s.myStream.getAudioTracks() && s.myStream.getAudioTracks().length) return Janus.error("Can't add audio stream, there already is one"), void n.error("Can't add audio stream, there already is one")
				} else r.removeAudio ? (r.keepAudio = !1, r.replaceAudio = !1, r.addAudio = !1, r.audioSend = !1) : r.replaceAudio && (r.keepAudio = !1, r.addAudio = !1, r.removeAudio = !1, r.audioSend = !0);
				if (s.myStream && s.myStream.getAudioTracks() && 0 !== s.myStream.getAudioTracks().length ? !_(r) || r.removeAudio || r.replaceAudio || (r.keepAudio = !0) : (r.replaceAudio && (r.keepAudio = !1, r.replaceAudio = !1, r.addAudio = !0, r.audioSend = !0), _(r) && (r.keepAudio = !1, r.addAudio = !0)), r.addVideo) {
					if (r.keepVideo = !1, r.replaceVideo = !1, r.removeVideo = !1, r.videoSend = !0, s.myStream && s.myStream.getVideoTracks() && s.myStream.getVideoTracks().length) return Janus.error("Can't add video stream, there already is one"), void n.error("Can't add video stream, there already is one")
				} else r.removeVideo ? (r.keepVideo = !1, r.replaceVideo = !1, r.addVideo = !1, r.videoSend = !1) : r.replaceVideo && (r.keepVideo = !1, r.addVideo = !1, r.removeVideo = !1, r.videoSend = !0);
				s.myStream && s.myStream.getVideoTracks() && 0 !== s.myStream.getVideoTracks().length ? !D(r) || r.removeVideo || r.replaceVideo || (r.keepVideo = !0) : (r.replaceVideo && (r.keepVideo = !1, r.replaceVideo = !1, r.addVideo = !0, r.videoSend = !0), D(r) && (r.keepVideo = !1, r.addVideo = !0)), r.addData && (r.data = !0)
			}
			if (_(r) && r.keepAudio && D(r) && r.keepVideo) return o.consentDialog(!1), void h(e, i, r, n, s.myStream)
		} else r.update = !1, r.keepAudio = !1, r.keepVideo = !1;
		if (r.update && !s.streamExternal) {
			if (r.removeAudio || r.replaceAudio) {
				if (s.myStream && s.myStream.getAudioTracks() && s.myStream.getAudioTracks().length) {
					var a = s.myStream.getAudioTracks()[0];
					Janus.log("Removing audio track:", a), s.myStream.removeTrack(a);
					try {
						a.stop()
					} catch (M) {}
				}
				if (s.pc.getSenders() && s.pc.getSenders().length) {
					var c = !0;
					if (r.replaceAudio && Janus.unifiedPlan && (c = !1), c)
						for (var l of s.pc.getSenders()) l && l.track && "audio" === l.track.kind && (Janus.log("Removing audio sender:", l), s.pc.removeTrack(l))
				}
			}
			if (r.removeVideo || r.replaceVideo) {
				if (s.myStream && s.myStream.getVideoTracks() && s.myStream.getVideoTracks().length) {
					var d = s.myStream.getVideoTracks()[0];
					Janus.log("Removing video track:", d), s.myStream.removeTrack(d);
					try {
						d.stop()
					} catch (M) {}
				}
				if (s.pc.getSenders() && s.pc.getSenders().length) {
					var u = !0;
					if (r.replaceVideo && Janus.unifiedPlan && (u = !1), u)
						for (var p of s.pc.getSenders()) p && p.track && "video" === p.track.kind && (Janus.log("Removing video sender:", p), s.pc.removeTrack(p))
				}
			}
		}
		if (n.stream) {
			var f = n.stream;
			if (Janus.log("MediaStream provided by the application"), Janus.debug(f), r.update && s.myStream && s.myStream !== n.stream && !s.streamExternal) {
				try {
					var m = s.myStream.getTracks();
					for (var g of m) Janus.log(g), g && g.stop()
				} catch (M) {}
				s.myStream = null
			}
			return s.streamExternal = !0, o.consentDialog(!1), void h(e, i, r, n, f)
		}
		if (_(r) || D(r)) {
			if (!Janus.isGetUserMediaAvailable()) return void n.error("getUserMedia not available");
			var v = {
				mandatory: {},
				optional: []
			};
			o.consentDialog(!0);
			var y = _(r);
			y && r && "object" == typeof r.audio && (y = r.audio);
			var A = D(r);
			if (A && r) {
				var b = !0 === n.simulcast,
					w = !0 === n.simulcast2;
				if (!b && !w || i || r.video || (r.video = "hires"), r.video && "screen" != r.video && "window" != r.video)
					if ("object" == typeof r.video) A = r.video;
					else {
						var S = 0,
							C = 0;
						"lowres" === r.video ? (C = 240, 240, S = 320) : "lowres-16:9" === r.video ? (C = 180, 180, S = 320) : "hires" === r.video || "hires-16:9" === r.video || "hdres" === r.video ? (C = 720, 720, S = 1280) : "fhdres" === r.video ? (C = 1080, 1080, S = 1920) : "4kres" === r.video ? (C = 2160, 2160, S = 3840) : "stdres" === r.video ? (C = 480, 480, S = 640) : "stdres-16:9" === r.video ? (C = 360, 360, S = 640) : (Janus.log("Default video setting is stdres 4:3"), C = 480, 480, S = 640), Janus.log("Adding media constraint:", r.video), A = {
							height: {
								ideal: C
							},
							width: {
								ideal: S
							}
						}, Janus.log("Adding video constraint:", A)
					}
				else if ("screen" === r.video || "window" === r.video) {
					if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) return v.video = {}, r.screenshareFrameRate && (v.video.frameRate = r.screenshareFrameRate), r.screenshareHeight && (v.video.height = r.screenshareHeight), r.screenshareWidth && (v.video.width = r.screenshareWidth), v.audio = r.captureDesktopAudio, void navigator.mediaDevices.getDisplayMedia(v).then(function (t) {
						o.consentDialog(!1), _(r) && !r.keepAudio ? navigator.mediaDevices.getUserMedia({
							audio: !0,
							video: !1
						}).then(function (o) {
							t.addTrack(o.getAudioTracks()[0]), h(e, i, r, n, t)
						}) : h(e, i, r, n, t)
					}, function (e) {
						o.consentDialog(!1), n.error(e)
					});

					function x(t, s) {
						o.consentDialog(!1), t ? n.error(t) : h(e, i, r, n, s)
					}

					function k(e, t, n) {
						Janus.log("Adding media constraint (screen capture)"), Janus.debug(e), navigator.mediaDevices.getUserMedia(e).then(function (e) {
							n ? navigator.mediaDevices.getUserMedia({
								audio: !0,
								video: !1
							}).then(function (n) {
								e.addTrack(n.getAudioTracks()[0]), t(null, e)
							}) : t(null, e)
						})["catch"](function (e) {
							o.consentDialog(!1), t(e)
						})
					}
					if ("chrome" === Janus.webRTCAdapter.browserDetails.browser) {
						var P = Janus.webRTCAdapter.browserDetails.version,
							R = 33;
						window.navigator.userAgent.match("Linux") && (R = 35), P >= 26 && P <= R ? k(v = {
							video: {
								mandatory: {
									googLeakyBucket: !0,
									maxWidth: window.screen.width,
									maxHeight: window.screen.height,
									minFrameRate: r.screenshareFrameRate,
									maxFrameRate: r.screenshareFrameRate,
									chromeMediaSource: "screen"
								}
							},
							audio: _(r) && !r.keepAudio
						}, x) : Janus.extension.getScreen(function (e, t) {
							if (e) return o.consentDialog(!1), n.error(e);
							(v = {
								audio: !1,
								video: {
									mandatory: {
										chromeMediaSource: "desktop",
										maxWidth: window.screen.width,
										maxHeight: window.screen.height,
										minFrameRate: r.screenshareFrameRate,
										maxFrameRate: r.screenshareFrameRate
									},
									optional: [{
										googLeakyBucket: !0
									}, {
										googTemporalLayeredScreencast: !0
									}]
								}
							}).video.mandatory.chromeMediaSourceId = t, k(v, x, _(r) && !r.keepAudio)
						})
					} else if ("firefox" === Janus.webRTCAdapter.browserDetails.browser) {
						if (!(Janus.webRTCAdapter.browserDetails.version >= 33)) {
							var O = new Error("NavigatorUserMediaError");
							return O.name = "Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)", o.consentDialog(!1), void n.error(O)
						}
						k(v = {
							video: {
								mozMediaSource: r.video,
								mediaSource: r.video
							},
							audio: _(r) && !r.keepAudio
						}, function (e, t) {
							if (x(e, t), !e) var n = t.currentTime,
								i = window.setInterval(function () {
									t || window.clearInterval(i), t.currentTime == n && (window.clearInterval(i), t.onended && t.onended()), n = t.currentTime
								}, 500)
						})
					}
					return
				}
			}
			r && "screen" === r.video || navigator.mediaDevices.enumerateDevices().then(function (t) {
				var s = t.some(function (e) {
						return "audioinput" === e.kind
					}),
					a = I(r) || t.some(function (e) {
						return "videoinput" === e.kind
					}),
					c = _(r),
					l = D(r),
					d = E(r),
					u = $(r);
				if (c || l || d || u) {
					var p = !!c && s,
						m = !!l && a;
					if (!p && !m) return o.consentDialog(!1), n.error("No capture device found"), !1;
					if (!p && d) return o.consentDialog(!1), n.error("Audio capture is required, but no capture device found"), !1;
					if (!m && u) return o.consentDialog(!1), n.error("Video capture is required, but no capture device found"), !1
				}
				var g = {
					audio: !(!s || r.keepAudio) && y,
					video: !(!a || r.keepVideo) && A
				};
				Janus.debug("getUserMedia constraints", g), g.audio || g.video ? navigator.mediaDevices.getUserMedia(g).then(function (t) {
					o.consentDialog(!1), h(e, i, r, n, t)
				})["catch"](function (e) {
					o.consentDialog(!1), n.error({
						code: e.code,
						name: e.name,
						message: e.message
					})
				}) : (o.consentDialog(!1), h(e, i, r, n, f))
			})["catch"](function (e) {
				o.consentDialog(!1), n.error("enumerateDevices error", e)
			})
		} else h(e, i, r, n)
	}

	function g(e, t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : T;
		var n = t.jsep,
			i = te[e];
		if (!i || !i.webrtcStuff) return Janus.warn("Invalid handle"), void t.error("Invalid handle");
		var r = i.webrtcStuff;
		if (n) {
			if (!r.pc) return Janus.warn("Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep"), void t.error("No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep");
			r.pc.setRemoteDescription(n).then(function () {
				if (Janus.log("Remote description accepted!"), r.remoteSdp = n.sdp, r.candidates && r.candidates.length > 0) {
					for (var e = 0; e < r.candidates.length; e++) {
						var i = r.candidates[e];
						Janus.debug("Adding remote candidate:", i), i && !0 !== i.completed ? r.pc.addIceCandidate(i) : r.pc.addIceCandidate(Janus.endOfCandidates)
					}
					r.candidates = []
				}
				t.success()
			}, t.error)
		} else t.error("Invalid JSEP")
	}

	function v(e, n, i) {
		(i = i || {}).success = "function" == typeof i.success ? i.success : Janus.noop, i.error = "function" == typeof i.error ? i.error : Janus.noop, i.customizeSdp = "function" == typeof i.customizeSdp ? i.customizeSdp : Janus.noop;
		var r = te[e];
		if (!r || !r.webrtcStuff) return Janus.warn("Invalid handle"), void i.error("Invalid handle");
		var o = r.webrtcStuff,
			s = !0 === i.simulcast;
		s ? Janus.log("Creating offer (iceDone=" + o.iceDone + ", simulcast=" + s + ")") : Janus.log("Creating offer (iceDone=" + o.iceDone + ")");
		var a = {};
		if (Janus.unifiedPlan) {
			var c = null,
				l = null,
				d = o.pc.getTransceivers();
			if (d && d.length > 0)
				for (var u of d) u.sender && u.sender.track && "audio" === u.sender.track.kind || u.receiver && u.receiver.track && "audio" === u.receiver.track.kind ? c || (c = u) : (u.sender && u.sender.track && "video" === u.sender.track.kind || u.receiver && u.receiver.track && "video" === u.receiver.track.kind) && (l || (l = u));
			var p = _(n),
				f = P(n);
			p || f ? p && f ? c && (c.setDirection ? c.setDirection("sendrecv") : c.direction = "sendrecv", Janus.log("Setting audio transceiver to sendrecv:", c)) : p && !f ? c && (c.setDirection ? c.setDirection("sendonly") : c.direction = "sendonly", Janus.log("Setting audio transceiver to sendonly:", c)) : !p && f && (c ? (c.setDirection ? c.setDirection("recvonly") : c.direction = "recvonly", Janus.log("Setting audio transceiver to recvonly:", c)) : (c = o.pc.addTransceiver("audio", {
				direction: "recvonly"
			}), Janus.log("Adding recvonly audio transceiver:", c))) : n.removeAudio && c && (c.setDirection ? c.setDirection("inactive") : c.direction = "inactive", Janus.log("Setting audio transceiver to inactive:", c));
			var h = D(n),
				m = R(n);
			h || m ? h && m ? l && (l.setDirection ? l.setDirection("sendrecv") : l.direction = "sendrecv", Janus.log("Setting video transceiver to sendrecv:", l)) : h && !m ? l && (l.setDirection ? l.setDirection("sendonly") : l.direction = "sendonly", Janus.log("Setting video transceiver to sendonly:", l)) : !h && m && (l ? (l.setDirection ? l.setDirection("recvonly") : l.direction = "recvonly", Janus.log("Setting video transceiver to recvonly:", l)) : (l = o.pc.addTransceiver("video", {
				direction: "recvonly"
			}), Janus.log("Adding recvonly video transceiver:", l))) : n.removeVideo && l && (l.setDirection ? l.setDirection("inactive") : l.direction = "inactive", Janus.log("Setting video transceiver to inactive:", l))
		} else a.offerToReceiveAudio = P(n), a.offerToReceiveVideo = R(n);
		!0 === i.iceRestart && (a.iceRestart = !0), Janus.debug(a);
		var g = D(n);
		if (g && s && "firefox" === Janus.webRTCAdapter.browserDetails.browser) {
			Janus.log("Enabling Simulcasting for Firefox (RID)");
			var v = o.pc.getSenders().find(function (e) {
				return "video" === e.track.kind
			});
			if (v) {
				var y = v.getParameters();
				y || (y = {});
				var A = t(i.simulcastMaxBitrates);
				y.encodings = [{
					rid: "h",
					active: !0,
					maxBitrate: A.high
				}, {
					rid: "m",
					active: !0,
					maxBitrate: A.medium,
					scaleResolutionDownBy: 2
				}, {
					rid: "l",
					active: !0,
					maxBitrate: A.low,
					scaleResolutionDownBy: 4
				}], v.setParameters(y)
			}
		}
		o.pc.createOffer(a).then(function (e) {
			Janus.debug(e);
			var t = {
				type: e.type,
				sdp: e.sdp
			};
			i.customizeSdp(t), e.sdp = t.sdp, Janus.log("Setting local description"), g && s && ("chrome" === Janus.webRTCAdapter.browserDetails.browser || "safari" === Janus.webRTCAdapter.browserDetails.browser ? (Janus.log("Enabling Simulcasting for Chrome (SDP munging)"), e.sdp = k(e.sdp)) : "firefox" !== Janus.webRTCAdapter.browserDetails.browser && Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring")), o.mySdp = e.sdp, o.pc.setLocalDescription(e)["catch"](i.error), o.mediaConstraints = a, o.iceDone || o.trickle ? ((o.senderTransforms || o.receiverTransforms) && (e.e2ee = !0), i.success(e)) : Janus.log("Waiting for all candidates...")
		}, i.error)
	}

	function y(e, n, i) {
		(i = i || {}).success = "function" == typeof i.success ? i.success : Janus.noop, i.error = "function" == typeof i.error ? i.error : Janus.noop, i.customizeSdp = "function" == typeof i.customizeSdp ? i.customizeSdp : Janus.noop;
		var r = te[e];
		if (!r || !r.webrtcStuff) return Janus.warn("Invalid handle"), void i.error("Invalid handle");
		var o = r.webrtcStuff,
			s = !0 === i.simulcast;
		s ? Janus.log("Creating answer (iceDone=" + o.iceDone + ", simulcast=" + s + ")") : Janus.log("Creating answer (iceDone=" + o.iceDone + ")");
		var a = null;
		if (Janus.unifiedPlan) {
			a = {};
			var c = null,
				l = null,
				d = o.pc.getTransceivers();
			if (d && d.length > 0)
				for (var u of d) u.sender && u.sender.track && "audio" === u.sender.track.kind || u.receiver && u.receiver.track && "audio" === u.receiver.track.kind ? c || (c = u) : (u.sender && u.sender.track && "video" === u.sender.track.kind || u.receiver && u.receiver.track && "video" === u.receiver.track.kind) && (l || (l = u));
			var p = _(n),
				f = P(n);
			if (p || f) {
				if (p && f) {
					if (c) try {
						c.setDirection ? c.setDirection("sendrecv") : c.direction = "sendrecv", Janus.log("Setting audio transceiver to sendrecv:", c)
					} catch (b) {
						Janus.error(b)
					}
				} else if (p && !f) try {
					c && (c.setDirection ? c.setDirection("sendonly") : c.direction = "sendonly", Janus.log("Setting audio transceiver to sendonly:", c))
				} catch (b) {
					Janus.error(b)
				} else if (!p && f)
					if (c) try {
						c.setDirection ? c.setDirection("recvonly") : c.direction = "recvonly", Janus.log("Setting audio transceiver to recvonly:", c)
					} catch (b) {
						Janus.error(b)
					} else c = o.pc.addTransceiver("audio", {
						direction: "recvonly"
					}), Janus.log("Adding recvonly audio transceiver:", c)
			} else if (n.removeAudio && c) try {
				c.setDirection ? c.setDirection("inactive") : c.direction = "inactive", Janus.log("Setting audio transceiver to inactive:", c)
			} catch (b) {
				Janus.error(b)
			}
			var h = D(n),
				m = R(n);
			if (h || m) {
				if (h && m) {
					if (l) try {
						l.setDirection ? l.setDirection("sendrecv") : l.direction = "sendrecv", Janus.log("Setting video transceiver to sendrecv:", l)
					} catch (b) {
						Janus.error(b)
					}
				} else if (h && !m) {
					if (l) try {
						l.setDirection ? l.setDirection("sendonly") : l.direction = "sendonly", Janus.log("Setting video transceiver to sendonly:", l)
					} catch (b) {
						Janus.error(b)
					}
				} else if (!h && m)
					if (l) try {
						l.setDirection ? l.setDirection("recvonly") : l.direction = "recvonly", Janus.log("Setting video transceiver to recvonly:", l)
					} catch (b) {
						Janus.error(b)
					} else l = o.pc.addTransceiver("video", {
						direction: "recvonly"
					}), Janus.log("Adding recvonly video transceiver:", l)
			} else if (n.removeVideo && l) try {
				l.setDirection ? l.setDirection("inactive") : l.direction = "inactive", Janus.log("Setting video transceiver to inactive:", l)
			} catch (b) {
				Janus.error(b)
			}
		} else a = "firefox" === Janus.webRTCAdapter.browserDetails.browser || "edge" === Janus.webRTCAdapter.browserDetails.browser ? {
			offerToReceiveAudio: P(n),
			offerToReceiveVideo: R(n)
		} : {
			mandatory: {
				OfferToReceiveAudio: P(n),
				OfferToReceiveVideo: R(n)
			}
		};
		Janus.debug(a);
		var g = D(n);
		if (g && s && "firefox" === Janus.webRTCAdapter.browserDetails.browser) {
			Janus.log("Enabling Simulcasting for Firefox (RID)");
			var v = o.pc.getSenders()[1];
			Janus.log(v);
			var y = v.getParameters();
			Janus.log(y);
			var A = t(i.simulcastMaxBitrates);
			v.setParameters({
				encodings: [{
					rid: "high",
					active: !0,
					priority: "high",
					maxBitrate: A.high
				}, {
					rid: "medium",
					active: !0,
					priority: "medium",
					maxBitrate: A.medium
				}, {
					rid: "low",
					active: !0,
					priority: "low",
					maxBitrate: A.low
				}]
			})
		}
		o.pc.createAnswer(a).then(function (e) {
			Janus.debug(e);
			var t = {
				type: e.type,
				sdp: e.sdp
			};
			i.customizeSdp(t), e.sdp = t.sdp, Janus.log("Setting local description"), g && s && ("chrome" === Janus.webRTCAdapter.browserDetails.browser ? Janus.warn("simulcast=true, but this is an answer, and video breaks in Chrome if we enable it") : "firefox" !== Janus.webRTCAdapter.browserDetails.browser && Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring")), o.mySdp = e.sdp, o.pc.setLocalDescription(e)["catch"](i.error), o.mediaConstraints = a, o.iceDone || o.trickle ? ((o.senderTransforms || o.receiverTransforms) && (e.e2ee = !0), i.success(e)) : Janus.log("Waiting for all candidates...")
		}, i.error)
	}

	function A(e, t) {
		(t = t || {}).success = "function" == typeof t.success ? t.success : Janus.noop, t.error = "function" == typeof t.error ? t.error : Janus.noop;
		var n = te[e];
		if (n && n.webrtcStuff) {
			var i = n.webrtcStuff;
			Janus.log("Sending offer/answer SDP..."), i.mySdp ? (i.mySdp = {
				type: i.pc.localDescription.type,
				sdp: i.pc.localDescription.sdp
			}, !1 === i.trickle && (i.mySdp.trickle = !1), Janus.debug(t), i.sdpSent = !0, t.success(i.mySdp)) : Janus.warn("Local SDP instance is invalid, not sending anything...")
		} else Janus.warn("Invalid handle, not sending anything")
	}

	function b(e, t) {
		var n = te[e];
		if (!n || !n.webrtcStuff) return Janus.warn("Invalid handle"), 0;
		var i = t ? "remote" : "local",
			r = n.webrtcStuff;
		return r.volume[i] || (r.volume[i] = {
			value: 0
		}), !r.pc.getStats || "chrome" !== Janus.webRTCAdapter.browserDetails.browser && "safari" !== Janus.webRTCAdapter.browserDetails.browser ? (Janus.warn("Getting the " + i + " volume unsupported by browser"), 0) : t && !r.remoteStream ? (Janus.warn("Remote stream unavailable"), 0) : t || r.myStream ? r.volume[i].timer ? r.volume[i].value : (Janus.log("Starting " + i + " volume monitor"), r.volume[i].timer = setInterval(function () {
			r.pc.getStats().then(function (e) {
				e.forEach(function (e) {
					e && "audio" === e.kind && (t && !e.remoteSource || !t && "media-source" !== e.type || (r.volume[i].value = e.audioLevel ? e.audioLevel : 0))
				})
			})
		}, 200), 0) : (Janus.warn("Local stream unavailable"), 0)
	}

	function w(e, t) {
		var n = te[e];
		if (!n || !n.webrtcStuff) return Janus.warn("Invalid handle"), !0;
		var i = n.webrtcStuff;
		return i.pc ? i.myStream ? t ? i.myStream.getVideoTracks() && 0 !== i.myStream.getVideoTracks().length ? !i.myStream.getVideoTracks()[0].enabled : (Janus.warn("No video track"), !0) : i.myStream.getAudioTracks() && 0 !== i.myStream.getAudioTracks().length ? !i.myStream.getAudioTracks()[0].enabled : (Janus.warn("No audio track"), !0) : (Janus.warn("Invalid local MediaStream"), !0) : (Janus.warn("Invalid PeerConnection"), !0)
	}

	function S(e, t, n) {
		var i = te[e];
		if (!i || !i.webrtcStuff) return Janus.warn("Invalid handle"), !1;
		var r = i.webrtcStuff;
		return r.pc ? r.myStream ? t ? r.myStream.getVideoTracks() && 0 !== r.myStream.getVideoTracks().length ? (r.myStream.getVideoTracks()[0].enabled = !n, !0) : (Janus.warn("No video track"), !1) : r.myStream.getAudioTracks() && 0 !== r.myStream.getAudioTracks().length ? (r.myStream.getAudioTracks()[0].enabled = !n, !0) : (Janus.warn("No audio track"), !1) : (Janus.warn("Invalid local MediaStream"), !1) : (Janus.warn("Invalid PeerConnection"), !1)
	}

	function C(e) {
		var t = te[e];
		if (!t || !t.webrtcStuff) return Janus.warn("Invalid handle"), "Invalid handle";
		var n = t.webrtcStuff;
		return n.pc ? n.pc.getStats ? n.bitrate.timer ? n.bitrate.value : (Janus.log("Starting bitrate timer (via getStats)"), n.bitrate.timer = setInterval(function () {
			n.pc.getStats().then(function (e) {
				e.forEach(function (e) {
					if (e) {
						var t = !1;
						if (("video" === e.mediaType || e.id.toLowerCase().indexOf("video") > -1) && "inbound-rtp" === e.type && e.id.indexOf("rtcp") < 0 ? t = !0 : "ssrc" != e.type || !e.bytesReceived || "VP8" !== e.googCodecName && "" !== e.googCodecName || (t = !0), t)
							if (n.bitrate.bsnow = e.bytesReceived, n.bitrate.tsnow = e.timestamp, null === n.bitrate.bsbefore || null === n.bitrate.tsbefore) n.bitrate.bsbefore = n.bitrate.bsnow, n.bitrate.tsbefore = n.bitrate.tsnow;
							else {
								var i = n.bitrate.tsnow - n.bitrate.tsbefore;
								"safari" === Janus.webRTCAdapter.browserDetails.browser && (i /= 1e3);
								var r = Math.round(8 * (n.bitrate.bsnow - n.bitrate.bsbefore) / i);
								"safari" === Janus.webRTCAdapter.browserDetails.browser && (r = parseInt(r / 1e3)), n.bitrate.value = r + " kbits/sec", n.bitrate.bsbefore = n.bitrate.bsnow, n.bitrate.tsbefore = n.bitrate.tsnow
							}
					}
				})
			})
		}, 1e3), "0 kbits/sec") : (Janus.warn("Getting the video bitrate unsupported by browser"), "Feature unsupported by browser") : "Invalid PeerConnection"
	}

	function T(e) {
		Janus.error("WebRTC error:", e)
	}

	function x(e, t) {
		Janus.log("Cleaning WebRTC stuff");
		var n = te[e];
		if (n) {
			var i = n.webrtcStuff;
			if (i) {
				if (!0 === t) {
					var r = {
						janus: "hangup",
						transaction: Janus.randomString(12)
					};
					n.token && (r.token = n.token), Y && (r.apisecret = Y), Janus.debug("Sending hangup request (handle=" + e + "):"), Janus.debug(r), M ? (r.session_id = ee, r.handle_id = e, j.send(JSON.stringify(r))) : Janus.httpAPICall(B + "/" + ee + "/" + e, {
						verb: "POST",
						withCredentials: V,
						body: r
					})
				}
				i.remoteStream = null, i.volume && (i.volume.local && i.volume.local.timer && clearInterval(i.volume.local.timer), i.volume.remote && i.volume.remote.timer && clearInterval(i.volume.remote.timer)), i.volume = {}, i.bitrate.timer && clearInterval(i.bitrate.timer), i.bitrate.timer = null, i.bitrate.bsnow = null, i.bitrate.bsbefore = null, i.bitrate.tsnow = null, i.bitrate.tsbefore = null, i.bitrate.value = null;
				try {
					if (!i.streamExternal && i.myStream) {
						Janus.log("Stopping local stream tracks");
						var o = i.myStream.getTracks();
						for (var s of o) Janus.log(s), s && s.stop()
					}
				} catch (a) {}
				i.streamExternal = !1, i.myStream = null;
				try {
					i.pc.close()
				} catch (a) {}
				i.pc = null, i.candidates = null, i.mySdp = null, i.remoteSdp = null, i.iceDone = !1, i.dataChannel = {}, i.dtmfSender = null, i.senderTransforms = null, i.receiverTransforms = null
			}
			n.oncleanup()
		}
	}

	function k(e) {
		for (var t = e.split("\r\n"), n = !1, i = [-1], r = [-1], o = null, s = null, a = null, c = null, l = -1, d = 0; d < t.length; d++) {
			if (p = t[d].match(/m=(\w+) */)) {
				if ("video" === p[1]) {
					if (!(i[0] < 0)) {
						l = d;
						break
					}
					n = !0
				} else if (i[0] > -1) {
					l = d;
					break
				}
			} else if (n) {
				var u = t[d].match(/a=ssrc-group:FID (\d+) (\d+)/);
				if (u) i[0] = u[1], r[0] = u[2], t.splice(d, 1), d--;
				else {
					if (i[0]) {
						if ((h = t[d].match("a=ssrc:" + i[0] + " cname:(.+)")) && (o = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " msid:(.+)")) && (s = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " mslabel:(.+)")) && (a = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " label:(.+)")) && (c = h[1]), 0 === t[d].indexOf("a=ssrc:" + r[0])) {
							t.splice(d, 1), d--;
							continue
						}
						if (0 === t[d].indexOf("a=ssrc:" + i[0])) {
							t.splice(d, 1), d--;
							continue
						}
					}
					0 != t[d].length || (t.splice(d, 1), d--)
				}
			}
		}
		if (i[0] < 0) {
			l = -1, n = !1;
			for (d = 0; d < t.length; d++) {
				var p;
				if (p = t[d].match(/m=(\w+) */)) {
					if ("video" === p[1]) {
						if (!(i[0] < 0)) {
							l = d;
							break
						}
						n = !0
					} else if (i[0] > -1) {
						l = d;
						break
					}
				} else if (n) {
					if (i[0] < 0) {
						var f = t[d].match(/a=ssrc:(\d+)/);
						if (f) {
							i[0] = f[1], t.splice(d, 1), d--;
							continue
						}
					} else {
						var h;
						if ((h = t[d].match("a=ssrc:" + i[0] + " cname:(.+)")) && (o = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " msid:(.+)")) && (s = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " mslabel:(.+)")) && (a = h[1]), (h = t[d].match("a=ssrc:" + i[0] + " label:(.+)")) && (c = h[1]), 0 === t[d].indexOf("a=ssrc:" + r[0])) {
							t.splice(d, 1), d--;
							continue
						}
						if (0 === t[d].indexOf("a=ssrc:" + i[0])) {
							t.splice(d, 1), d--;
							continue
						}
					}
					0 !== t[d].length || (t.splice(d, 1), d--)
				}
			}
		}
		if (i[0] < 0) return Janus.warn("Couldn't find the video SSRC, simulcasting NOT enabled"), e;
		l < 0 && (l = t.length), i[1] = Math.floor(4294967295 * Math.random()), i[2] = Math.floor(4294967295 * Math.random()), r[1] = Math.floor(4294967295 * Math.random()), r[2] = Math.floor(4294967295 * Math.random());
		for (d = 0; d < i.length; d++) o && (t.splice(l, 0, "a=ssrc:" + i[d] + " cname:" + o), l++), s && (t.splice(l, 0, "a=ssrc:" + i[d] + " msid:" + s), l++), a && (t.splice(l, 0, "a=ssrc:" + i[d] + " mslabel:" + a), l++), c && (t.splice(l, 0, "a=ssrc:" + i[d] + " label:" + c), l++), o && (t.splice(l, 0, "a=ssrc:" + r[d] + " cname:" + o), l++), s && (t.splice(l, 0, "a=ssrc:" + r[d] + " msid:" + s), l++), a && (t.splice(l, 0, "a=ssrc:" + r[d] + " mslabel:" + a), l++), c && (t.splice(l, 0, "a=ssrc:" + r[d] + " label:" + c), l++);
		return t.splice(l, 0, "a=ssrc-group:FID " + i[2] + " " + r[2]), t.splice(l, 0, "a=ssrc-group:FID " + i[1] + " " + r[1]), t.splice(l, 0, "a=ssrc-group:FID " + i[0] + " " + r[0]), t.splice(l, 0, "a=ssrc-group:SIM " + i[0] + " " + i[1] + " " + i[2]), (e = t.join("\r\n")).endsWith("\r\n") || (e += "\r\n"), e
	}

	function _(e) {
		return Janus.debug("isAudioSendEnabled:", e), !e || !1 !== e.audio && (e.audioSend === undefined || null === e.audioSend || !0 === e.audioSend)
	}

	function E(e) {
		return Janus.debug("isAudioSendRequired:", e), !!e && (!1 !== e.audio && !1 !== e.audioSend && (e.failIfNoAudio !== undefined && null !== e.failIfNoAudio && !0 === e.failIfNoAudio))
	}

	function P(e) {
		return Janus.debug("isAudioRecvEnabled:", e), !e || !1 !== e.audio && (e.audioRecv === undefined || null === e.audioRecv || !0 === e.audioRecv)
	}

	function D(e) {
		return Janus.debug("isVideoSendEnabled:", e), !e || !1 !== e.video && (e.videoSend === undefined || null === e.videoSend || !0 === e.videoSend)
	}

	function $(e) {
		return Janus.debug("isVideoSendRequired:", e), !!e && (!1 !== e.video && !1 !== e.videoSend && (e.failIfNoVideo !== undefined && null !== e.failIfNoVideo && !0 === e.failIfNoVideo))
	}

	function R(e) {
		return Janus.debug("isVideoRecvEnabled:", e), !e || !1 !== e.video && (e.videoRecv === undefined || null === e.videoRecv || !0 === e.videoRecv)
	}

	function I(e) {
		if (Janus.debug("isScreenSendEnabled:", e), !e) return !1;
		if ("object" != typeof e.video || "object" != typeof e.video.mandatory) return !1;
		var t = e.video.mandatory;
		return t.chromeMediaSource ? "desktop" === t.chromeMediaSource || "screen" === t.chromeMediaSource : t.mozMediaSource ? "window" === t.mozMediaSource || "screen" === t.mozMediaSource : !!t.mediaSource && ("window" === t.mediaSource || "screen" === t.mediaSource)
	}

	function O(e) {
		return Janus.debug("isDataEnabled:", e), "edge" === Janus.webRTCAdapter.browserDetails.browser ? (Janus.warn("Edge doesn't support data channels yet"), !1) : e !== undefined && null !== e && !0 === e.data
	}

	function L(e) {
		return Janus.debug("isTrickleEnabled:", e), !1 !== e
	}
	if ((e = e || {}).success = "function" == typeof e.success ? e.success : Janus.noop, e.error = "function" == typeof e.error ? e.error : Janus.noop, e.destroyed = "function" == typeof e.destroyed ? e.destroyed : Janus.noop, !Janus.initDone) return e.error("Library not initialized"), {};
	if (!Janus.isWebrtcSupported()) return e.error("WebRTC not supported by this browser"), {};
	if (Janus.log("Library initialized: " + Janus.initDone), !e.server) return e.error("Invalid server url"), {};
	var M = !1,
		j = null,
		N = {},
		J = null,
		H = null,
		F = 0,
		B = e.server;
	Janus.isArray(B) ? (Janus.log("Multiple servers provided (" + B.length + "), will use the first that works"), B = null, H = e.server, Janus.debug(H)) : 0 === B.indexOf("ws") ? (M = !0, Janus.log("Using WebSockets to contact Janus: " + B)) : (M = !1, Janus.log("Using REST API to contact Janus: " + B));
	var q = e.iceServers || [{
			urls: "stun:stun.l.google.com:19302"
		}],
		z = e.iceTransportPolicy,
		W = e.bundlePolicy,
		U = !0 === e.ipv6,
		V = !1;
	e.withCredentials !== undefined && null !== e.withCredentials && (V = !0 === e.withCredentials);
	var G = 10;
	e.max_poll_events !== undefined && null !== e.max_poll_events && (G = e.max_poll_events), G < 1 && (G = 1);
	var Q = null;
	e.token !== undefined && null !== e.token && (Q = e.token);
	var Y = null;
	e.apisecret !== undefined && null !== e.apisecret && (Y = e.apisecret), this.destroyOnUnload = !0, e.destroyOnUnload !== undefined && null !== e.destroyOnUnload && (this.destroyOnUnload = !0 === e.destroyOnUnload);
	var X = 25e3;
	e.keepAlivePeriod !== undefined && null !== e.keepAlivePeriod && (X = e.keepAlivePeriod), isNaN(X) && (X = 25e3);
	var K = 6e4;
	e.longPollTimeout !== undefined && null !== e.longPollTimeout && (K = e.longPollTimeout), isNaN(K) && (K = 6e4);
	var Z = !1,
		ee = null,
		te = {},
		ne = this,
		ie = 0,
		re = {};
	o(e), this.getServer = function () {
		return B
	}, this.isConnected = function () {
		return Z
	}, this.reconnect = function (e) {
		(e = e || {}).success = "function" == typeof e.success ? e.success : Janus.noop, e.error = "function" == typeof e.error ? e.error : Janus.noop, e.reconnect = !0, o(e)
	}, this.getSessionId = function () {
		return ee
	}, this.destroy = function (e) {
		s(e)
	}, this.attach = function (e) {
		a(e)
	}
}! function (e, t) {
	"use strict";
	"object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
		if (!e.document) throw new Error("jQuery requires a window with a document");
		return t(e)
	} : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
	"use strict";

	function n(e, t, n) {
		var i, r, o = (n = n || we).createElement("script");
		if (o.text = e, t)
			for (i in Se)(r = t[i] || t.getAttribute && t.getAttribute(i)) && o.setAttribute(i, r);
		n.head.appendChild(o).parentNode.removeChild(o)
	}

	function i(e) {
		return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? fe[he.call(e)] || "object" : typeof e
	}

	function r(e) {
		var t = !!e && "length" in e && e.length,
			n = i(e);
		return !Ae(e) && !be(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
	}

	function o(e, t) {
		return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
	}

	function s(e, t, n) {
		return Ae(t) ? Te.grep(e, function (e, i) {
			return !!t.call(e, i, e) !== n
		}) : t.nodeType ? Te.grep(e, function (e) {
			return e === t !== n
		}) : "string" != typeof t ? Te.grep(e, function (e) {
			return pe.call(t, e) > -1 !== n
		}) : Te.filter(t, e, n)
	}

	function a(e, t) {
		for (;
			(e = e[t]) && 1 !== e.nodeType;);
		return e
	}

	function c(e) {
		var t = {};
		return Te.each(e.match(Oe) || [], function (e, n) {
			t[n] = !0
		}), t
	}

	function l(e) {
		return e
	}

	function d(e) {
		throw e
	}

	function u(e, t, n, i) {
		var r;
		try {
			e && Ae(r = e.promise) ? r.call(e).done(t).fail(n) : e && Ae(r = e.then) ? r.call(e, t, n) : t.apply(undefined, [e].slice(i))
		} catch (e) {
			n.apply(undefined, [e])
		}
	}

	function p() {
		we.removeEventListener("DOMContentLoaded", p), e.removeEventListener("load", p), Te.ready()
	}

	function f(e, t) {
		return t.toUpperCase()
	}

	function h(e) {
		return e.replace(Ne, "ms-").replace(Je, f)
	}

	function m() {
		this.expando = Te.expando + m.uid++
	}

	function g(e) {
		return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : qe.test(e) ? JSON.parse(e) : e)
	}

	function v(e, t, n) {
		var i;
		if (n === undefined && 1 === e.nodeType)
			if (i = "data-" + t.replace(ze, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(i))) {
				try {
					n = g(n)
				} catch (r) {}
				Be.set(e, t, n)
			} else n = undefined;
		return n
	}

	function y(e, t, n, i) {
		var r, o, s = 20,
			a = i ? function () {
				return i.cur()
			} : function () {
				return Te.css(e, t, "")
			},
			c = a(),
			l = n && n[3] || (Te.cssNumber[t] ? "" : "px"),
			d = e.nodeType && (Te.cssNumber[t] || "px" !== l && +c) && Ue.exec(Te.css(e, t));
		if (d && d[3] !== l) {
			for (c /= 2, l = l || d[3], d = +c || 1; s--;) Te.style(e, t, d + l), (1 - o) * (1 - (o = a() / c || .5)) <= 0 && (s = 0), d /= o;
			d *= 2, Te.style(e, t, d + l), n = n || []
		}
		return n && (d = +d || +c || 0, r = n[1] ? d + (n[1] + 1) * n[2] : +n[2], i && (i.unit = l, i.start = d, i.end = r)), r
	}

	function A(e) {
		var t, n = e.ownerDocument,
			i = e.nodeName,
			r = Ke[i];
		return r || (t = n.body.appendChild(n.createElement(i)), r = Te.css(t, "display"), t.parentNode.removeChild(t), "none" === r && (r = "block"), Ke[i] = r, r)
	}

	function b(e, t) {
		for (var n, i, r = [], o = 0, s = e.length; o < s; o++)(i = e[o]).style && (n = i.style.display, t ? ("none" === n && (r[o] = Fe.get(i, "display") || null, r[o] || (i.style.display = "")), "" === i.style.display && Xe(i) && (r[o] = A(i))) : "none" !== n && (r[o] = "none", Fe.set(i, "display", n)));
		for (o = 0; o < s; o++) null != r[o] && (e[o].style.display = r[o]);
		return e
	}

	function w(e, t) {
		var n;
		return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], t === undefined || t && o(e, t) ? Te.merge([e], n) : n
	}

	function S(e, t) {
		for (var n = 0, i = e.length; n < i; n++) Fe.set(e[n], "globalEval", !t || Fe.get(t[n], "globalEval"))
	}

	function C(e, t, n, r, o) {
		for (var s, a, c, l, d, u, p = t.createDocumentFragment(), f = [], h = 0, m = e.length; h < m; h++)
			if ((s = e[h]) || 0 === s)
				if ("object" === i(s)) Te.merge(f, s.nodeType ? [s] : s);
				else if (ot.test(s)) {
			for (a = a || p.appendChild(t.createElement("div")), c = (nt.exec(s) || ["", ""])[1].toLowerCase(), l = rt[c] || rt._default, a.innerHTML = l[1] + Te.htmlPrefilter(s) + l[2], u = l[0]; u--;) a = a.lastChild;
			Te.merge(f, a.childNodes), (a = p.firstChild).textContent = ""
		} else f.push(t.createTextNode(s));
		for (p.textContent = "", h = 0; s = f[h++];)
			if (r && Te.inArray(s, r) > -1) o && o.push(s);
			else if (d = Qe(s), a = w(p.appendChild(s), "script"), d && S(a), n)
			for (u = 0; s = a[u++];) it.test(s.type || "") && n.push(s);
		return p
	}

	function T() {
		return !0
	}

	function x() {
		return !1
	}

	function k(e, t) {
		return e === _() == ("focus" === t)
	}

	function _() {
		try {
			return we.activeElement
		} catch (e) {}
	}

	function E(e, t, n, i, r, o) {
		var s, a;
		if ("object" == typeof t) {
			for (a in "string" != typeof n && (i = i || n, n = undefined), t) E(e, a, n, i, t[a], o);
			return e
		}
		if (null == i && null == r ? (r = n, i = n = undefined) : null == r && ("string" == typeof n ? (r = i, i = undefined) : (r = i, i = n, n = undefined)), !1 === r) r = x;
		else if (!r) return e;
		return 1 === o && (s = r, (r = function (e) {
			return Te().off(e), s.apply(this, arguments)
		}).guid = s.guid || (s.guid = Te.guid++)), e.each(function () {
			Te.event.add(this, t, r, i, n)
		})
	}

	function P(e, t, n) {
		n ? (Fe.set(e, t, !1), Te.event.add(e, t, {
			namespace: !1,
			handler: function (e) {
				var i, r, o = Fe.get(this, t);
				if (1 & e.isTrigger && this[t]) {
					if (o.length)(Te.event.special[t] || {}).delegateType && e.stopPropagation();
					else if (o = le.call(arguments), Fe.set(this, t, o), i = n(this, t), this[t](), o !== (r = Fe.get(this, t)) || i ? Fe.set(this, t, !1) : r = {}, o !== r) return e.stopImmediatePropagation(), e.preventDefault(), r.value
				} else o.length && (Fe.set(this, t, {
					value: Te.event.trigger(Te.extend(o[0], Te.Event.prototype), o.slice(1), this)
				}), e.stopImmediatePropagation())
			}
		})) : Fe.get(e, t) === undefined && Te.event.add(e, t, T)
	}

	function D(e, t) {
		return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") && Te(e).children("tbody")[0] || e
	}

	function $(e) {
		return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
	}

	function R(e) {
		return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
	}

	function I(e, t) {
		var n, i, r, o, s, a;
		if (1 === t.nodeType) {
			if (Fe.hasData(e) && (a = Fe.get(e).events))
				for (r in Fe.remove(t, "handle events"), a)
					for (n = 0, i = a[r].length; n < i; n++) Te.event.add(t, r, a[r][n]);
			Be.hasData(e) && (o = Be.access(e), s = Te.extend({}, o), Be.set(t, s))
		}
	}

	function O(e, t) {
		var n = t.nodeName.toLowerCase();
		"input" === n && tt.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
	}

	function L(e, t, i, r) {
		t = de(t);
		var o, s, a, c, l, d, u = 0,
			p = e.length,
			f = p - 1,
			h = t[0],
			m = Ae(h);
		if (m || p > 1 && "string" == typeof h && !ye.checkClone && dt.test(h)) return e.each(function (n) {
			var o = e.eq(n);
			m && (t[0] = h.call(this, n, o.html())), L(o, t, i, r)
		});
		if (p && (s = (o = C(t, e[0].ownerDocument, !1, e, r)).firstChild, 1 === o.childNodes.length && (o = s), s || r)) {
			for (c = (a = Te.map(w(o, "script"), $)).length; u < p; u++) l = o, u !== f && (l = Te.clone(l, !0, !0), c && Te.merge(a, w(l, "script"))), i.call(e[u], l, u);
			if (c)
				for (d = a[a.length - 1].ownerDocument, Te.map(a, R), u = 0; u < c; u++) l = a[u], it.test(l.type || "") && !Fe.access(l, "globalEval") && Te.contains(d, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? Te._evalUrl && !l.noModule && Te._evalUrl(l.src, {
					nonce: l.nonce || l.getAttribute("nonce")
				}, d) : n(l.textContent.replace(ut, ""), l, d))
		}
		return e
	}

	function M(e, t, n) {
		for (var i, r = t ? Te.filter(t, e) : e, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || Te.cleanData(w(i)), i.parentNode && (n && Qe(i) && S(w(i, "script")), i.parentNode.removeChild(i));
		return e
	}

	function j(e, t, n) {
		var i, r, o, s, a = e.style;
		return (n = n || ft(e)) && ("" !== (s = n.getPropertyValue(t) || n[t]) || Qe(e) || (s = Te.style(e, t)), !ye.pixelBoxStyles() && pt.test(s) && mt.test(t) && (i = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = r, a.maxWidth = o)), s !== undefined ? s + "" : s
	}

	function N(e, t) {
		return {
			get: function () {
				if (!e()) return (this.get = t).apply(this, arguments);
				delete this.get
			}
		}
	}

	function J(e) {
		for (var t = e[0].toUpperCase() + e.slice(1), n = gt.length; n--;)
			if ((e = gt[n] + t) in vt) return e
	}

	function H(e) {
		var t = Te.cssProps[e] || yt[e];
		return t || (e in vt ? e : yt[e] = J(e) || e)
	}

	function F(e, t, n) {
		var i = Ue.exec(t);
		return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
	}

	function B(e, t, n, i, r, o) {
		var s = "width" === t ? 1 : 0,
			a = 0,
			c = 0;
		if (n === (i ? "border" : "content")) return 0;
		for (; s < 4; s += 2) "margin" === n && (c += Te.css(e, n + Ve[s], !0, r)), i ? ("content" === n && (c -= Te.css(e, "padding" + Ve[s], !0, r)), "margin" !== n && (c -= Te.css(e, "border" + Ve[s] + "Width", !0, r))) : (c += Te.css(e, "padding" + Ve[s], !0, r), "padding" !== n ? c += Te.css(e, "border" + Ve[s] + "Width", !0, r) : a += Te.css(e, "border" + Ve[s] + "Width", !0, r));
		return !i && o >= 0 && (c += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - c - a - .5)) || 0), c
	}

	function q(e, t, n) {
		var i = ft(e),
			r = (!ye.boxSizingReliable() || n) && "border-box" === Te.css(e, "boxSizing", !1, i),
			s = r,
			a = j(e, t, i),
			c = "offset" + t[0].toUpperCase() + t.slice(1);
		if (pt.test(a)) {
			if (!n) return a;
			a = "auto"
		}
		return (!ye.boxSizingReliable() && r || !ye.reliableTrDimensions() && o(e, "tr") || "auto" === a || !parseFloat(a) && "inline" === Te.css(e, "display", !1, i)) && e.getClientRects().length && (r = "border-box" === Te.css(e, "boxSizing", !1, i), (s = c in e) && (a = e[c])), (a = parseFloat(a) || 0) + B(e, t, n || (r ? "border" : "content"), s, i, a) + "px"
	}

	function z(e, t, n, i, r) {
		return new z.prototype.init(e, t, n, i, r)
	}

	function W() {
		Tt && (!1 === we.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(W) : e.setTimeout(W, Te.fx.interval), Te.fx.tick())
	}

	function U() {
		return e.setTimeout(function () {
			Ct = undefined
		}), Ct = Date.now()
	}

	function V(e, t) {
		var n, i = 0,
			r = {
				height: e
			};
		for (t = t ? 1 : 0; i < 4; i += 2 - t) r["margin" + (n = Ve[i])] = r["padding" + n] = e;
		return t && (r.opacity = r.width = e), r
	}

	function G(e, t, n) {
		for (var i, r = (X.tweeners[t] || []).concat(X.tweeners["*"]), o = 0, s = r.length; o < s; o++)
			if (i = r[o].call(n, t, e)) return i
	}

	function Q(e, t, n) {
		var i, r, o, s, a, c, l, d, u = "width" in t || "height" in t,
			p = this,
			f = {},
			h = e.style,
			m = e.nodeType && Xe(e),
			g = Fe.get(e, "fxshow");
		for (i in n.queue || (null == (s = Te._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function () {
				s.unqueued || a()
			}), s.unqueued++, p.always(function () {
				p.always(function () {
					s.unqueued--, Te.queue(e, "fx").length || s.empty.fire()
				})
			})), t)
			if (r = t[i], xt.test(r)) {
				if (delete t[i], o = o || "toggle" === r, r === (m ? "hide" : "show")) {
					if ("show" !== r || !g || g[i] === undefined) continue;
					m = !0
				}
				f[i] = g && g[i] || Te.style(e, i)
			} if ((c = !Te.isEmptyObject(t)) || !Te.isEmptyObject(f))
			for (i in u && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (l = g && g.display) && (l = Fe.get(e, "display")), "none" === (d = Te.css(e, "display")) && (l ? d = l : (b([e], !0), l = e.style.display || l, d = Te.css(e, "display"), b([e]))), ("inline" === d || "inline-block" === d && null != l) && "none" === Te.css(e, "float") && (c || (p.done(function () {
					h.display = l
				}), null == l && (d = h.display, l = "none" === d ? "" : d)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function () {
					h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
				})), c = !1, f) c || (g ? "hidden" in g && (m = g.hidden) : g = Fe.access(e, "fxshow", {
				display: l
			}), o && (g.hidden = !m), m && b([e], !0), p.done(function () {
				for (i in m || b([e]), Fe.remove(e, "fxshow"), f) Te.style(e, i, f[i])
			})), c = G(m ? g[i] : 0, i, p), i in g || (g[i] = c.start, m && (c.end = c.start, c.start = 0))
	}

	function Y(e, t) {
		var n, i, r, o, s;
		for (n in e)
			if (r = t[i = h(n)], o = e[n], Array.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (s = Te.cssHooks[i]) && "expand" in s)
				for (n in o = s.expand(o), delete e[i], o) n in e || (e[n] = o[n], t[n] = r);
			else t[i] = r
	}

	function X(e, t, n) {
		var i, r, o = 0,
			s = X.prefilters.length,
			a = Te.Deferred().always(function () {
				delete c.elem
			}),
			c = function () {
				if (r) return !1;
				for (var t = Ct || U(), n = Math.max(0, l.startTime + l.duration - t), i = 1 - (n / l.duration || 0), o = 0, s = l.tweens.length; o < s; o++) l.tweens[o].run(i);
				return a.notifyWith(e, [l, i, n]), i < 1 && s ? n : (s || a.notifyWith(e, [l, 1, 0]), a.resolveWith(e, [l]), !1)
			},
			l = a.promise({
				elem: e,
				props: Te.extend({}, t),
				opts: Te.extend(!0, {
					specialEasing: {},
					easing: Te.easing._default
				}, n),
				originalProperties: t,
				originalOptions: n,
				startTime: Ct || U(),
				duration: n.duration,
				tweens: [],
				createTween: function (t, n) {
					var i = Te.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
					return l.tweens.push(i), i
				},
				stop: function (t) {
					var n = 0,
						i = t ? l.tweens.length : 0;
					if (r) return this;
					for (r = !0; n < i; n++) l.tweens[n].run(1);
					return t ? (a.notifyWith(e, [l, 1, 0]), a.resolveWith(e, [l, t])) : a.rejectWith(e, [l, t]), this
				}
			}),
			d = l.props;
		for (Y(d, l.opts.specialEasing); o < s; o++)
			if (i = X.prefilters[o].call(l, e, d, l.opts)) return Ae(i.stop) && (Te._queueHooks(l.elem, l.opts.queue).stop = i.stop.bind(i)), i;
		return Te.map(d, G, l), Ae(l.opts.start) && l.opts.start.call(e, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), Te.fx.timer(Te.extend(c, {
			elem: e,
			anim: l,
			queue: l.opts.queue
		})), l
	}

	function K(e) {
		return (e.match(Oe) || []).join(" ")
	}

	function Z(e) {
		return e.getAttribute && e.getAttribute("class") || ""
	}

	function ee(e) {
		return Array.isArray(e) ? e : "string" == typeof e && e.match(Oe) || []
	}

	function te(e, t, n, r) {
		var o;
		if (Array.isArray(t)) Te.each(t, function (t, i) {
			n || jt.test(e) ? r(e, i) : te(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
		});
		else if (n || "object" !== i(t)) r(e, t);
		else
			for (o in t) te(e + "[" + o + "]", t[o], n, r)
	}

	function ne(e) {
		return function (t, n) {
			"string" != typeof t && (n = t, t = "*");
			var i, r = 0,
				o = t.toLowerCase().match(Oe) || [];
			if (Ae(n))
				for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
		}
	}

	function ie(e, t, n, i) {
		function r(a) {
			var c;
			return o[a] = !0, Te.each(e[a] || [], function (e, a) {
				var l = a(t, n, i);
				return "string" != typeof l || s || o[l] ? s ? !(c = l) : void 0 : (t.dataTypes.unshift(l), r(l), !1)
			}), c
		}
		var o = {},
			s = e === Qt;
		return r(t.dataTypes[0]) || !o["*"] && r("*")
	}

	function re(e, t) {
		var n, i, r = Te.ajaxSettings.flatOptions || {};
		for (n in t) t[n] !== undefined && ((r[n] ? e : i || (i = {}))[n] = t[n]);
		return i && Te.extend(!0, e, i), e
	}

	function oe(e, t, n) {
		for (var i, r, o, s, a = e.contents, c = e.dataTypes;
			"*" === c[0];) c.shift(), i === undefined && (i = e.mimeType || t.getResponseHeader("Content-Type"));
		if (i)
			for (r in a)
				if (a[r] && a[r].test(i)) {
					c.unshift(r);
					break
				} if (c[0] in n) o = c[0];
		else {
			for (r in n) {
				if (!c[0] || e.converters[r + " " + c[0]]) {
					o = r;
					break
				}
				s || (s = r)
			}
			o = o || s
		}
		if (o) return o !== c[0] && c.unshift(o), n[o]
	}

	function se(e, t, n, i) {
		var r, o, s, a, c, l = {},
			d = e.dataTypes.slice();
		if (d[1])
			for (s in e.converters) l[s.toLowerCase()] = e.converters[s];
		for (o = d.shift(); o;)
			if (e.responseFields[o] && (n[e.responseFields[o]] = t), !c && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), c = o, o = d.shift())
				if ("*" === o) o = c;
				else if ("*" !== c && c !== o) {
			if (!(s = l[c + " " + o] || l["* " + o]))
				for (r in l)
					if ((a = r.split(" "))[1] === o && (s = l[c + " " + a[0]] || l["* " + a[0]])) {
						!0 === s ? s = l[r] : !0 !== l[r] && (o = a[0], d.unshift(a[1]));
						break
					} if (!0 !== s)
				if (s && e.throws) t = s(t);
				else try {
					t = s(t)
				} catch (u) {
					return {
						state: "parsererror",
						error: s ? u : "No conversion from " + c + " to " + o
					}
				}
		}
		return {
			state: "success",
			data: t
		}
	}
	var ae = [],
		ce = Object.getPrototypeOf,
		le = ae.slice,
		de = ae.flat ? function (e) {
			return ae.flat.call(e)
		} : function (e) {
			return ae.concat.apply([], e)
		},
		ue = ae.push,
		pe = ae.indexOf,
		fe = {},
		he = fe.toString,
		me = fe.hasOwnProperty,
		ge = me.toString,
		ve = ge.call(Object),
		ye = {},
		Ae = function (e) {
			return "function" == typeof e && "number" != typeof e.nodeType
		},
		be = function (e) {
			return null != e && e === e.window
		},
		we = e.document,
		Se = {
			type: !0,
			src: !0,
			nonce: !0,
			noModule: !0
		},
		Ce = "3.5.1",
		Te = function (e, t) {
			return new Te.fn.init(e, t)
		};
	Te.fn = Te.prototype = {
		jquery: Ce,
		constructor: Te,
		length: 0,
		toArray: function () {
			return le.call(this)
		},
		get: function (e) {
			return null == e ? le.call(this) : e < 0 ? this[e + this.length] : this[e]
		},
		pushStack: function (e) {
			var t = Te.merge(this.constructor(), e);
			return t.prevObject = this, t
		},
		each: function (e) {
			return Te.each(this, e)
		},
		map: function (e) {
			return this.pushStack(Te.map(this, function (t, n) {
				return e.call(t, n, t)
			}))
		},
		slice: function () {
			return this.pushStack(le.apply(this, arguments))
		},
		first: function () {
			return this.eq(0)
		},
		last: function () {
			return this.eq(-1)
		},
		even: function () {
			return this.pushStack(Te.grep(this, function (e, t) {
				return (t + 1) % 2
			}))
		},
		odd: function () {
			return this.pushStack(Te.grep(this, function (e, t) {
				return t % 2
			}))
		},
		eq: function (e) {
			var t = this.length,
				n = +e + (e < 0 ? t : 0);
			return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
		},
		end: function () {
			return this.prevObject || this.constructor()
		},
		push: ue,
		sort: ae.sort,
		splice: ae.splice
	}, Te.extend = Te.fn.extend = function () {
		var e, t, n, i, r, o, s = arguments[0] || {},
			a = 1,
			c = arguments.length,
			l = !1;
		for ("boolean" == typeof s && (l = s, s = arguments[a] || {}, a++), "object" == typeof s || Ae(s) || (s = {}), a === c && (s = this, a--); a < c; a++)
			if (null != (e = arguments[a]))
				for (t in e) i = e[t], "__proto__" !== t && s !== i && (l && i && (Te.isPlainObject(i) || (r = Array.isArray(i))) ? (n = s[t], o = r && !Array.isArray(n) ? [] : r || Te.isPlainObject(n) ? n : {}, r = !1, s[t] = Te.extend(l, o, i)) : i !== undefined && (s[t] = i));
		return s
	}, Te.extend({
		expando: "jQuery" + (Ce + Math.random()).replace(/\D/g, ""),
		isReady: !0,
		error: function (e) {
			throw new Error(e)
		},
		noop: function () {},
		isPlainObject: function (e) {
			var t, n;
			return !(!e || "[object Object]" !== he.call(e)) && (!(t = ce(e)) || "function" == typeof (n = me.call(t, "constructor") && t.constructor) && ge.call(n) === ve)
		},
		isEmptyObject: function (e) {
			var t;
			for (t in e) return !1;
			return !0
		},
		globalEval: function (e, t, i) {
			n(e, {
				nonce: t && t.nonce
			}, i)
		},
		each: function (e, t) {
			var n, i = 0;
			if (r(e))
				for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
			else
				for (i in e)
					if (!1 === t.call(e[i], i, e[i])) break;
			return e
		},
		makeArray: function (e, t) {
			var n = t || [];
			return null != e && (r(Object(e)) ? Te.merge(n, "string" == typeof e ? [e] : e) : ue.call(n, e)), n
		},
		inArray: function (e, t, n) {
			return null == t ? -1 : pe.call(t, e, n)
		},
		merge: function (e, t) {
			for (var n = +t.length, i = 0, r = e.length; i < n; i++) e[r++] = t[i];
			return e.length = r, e
		},
		grep: function (e, t, n) {
			for (var i = [], r = 0, o = e.length, s = !n; r < o; r++) !t(e[r], r) !== s && i.push(e[r]);
			return i
		},
		map: function (e, t, n) {
			var i, o, s = 0,
				a = [];
			if (r(e))
				for (i = e.length; s < i; s++) null != (o = t(e[s], s, n)) && a.push(o);
			else
				for (s in e) null != (o = t(e[s], s, n)) && a.push(o);
			return de(a)
		},
		guid: 1,
		support: ye
	}), "function" == typeof Symbol && (Te.fn[Symbol.iterator] = ae[Symbol.iterator]), Te.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
		fe["[object " + t + "]"] = t.toLowerCase()
	});
	var xe =
		/*!
		 * Sizzle CSS Selector Engine v2.3.5
		 * https://sizzlejs.com/
		 *
		 * Copyright JS Foundation and other contributors
		 * Released under the MIT license
		 * https://js.foundation/
		 *
		 * Date: 2020-03-14
		 */
		function (e) {
			function t(e, t, n, i) {
				var r, o, s, a, c, l, d, p = t && t.ownerDocument,
					h = t ? t.nodeType : 9;
				if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
				if (!i && (R(t), t = t || I, L)) {
					if (11 !== h && (c = Ae.exec(e)))
						if (r = c[1]) {
							if (9 === h) {
								if (!(s = t.getElementById(r))) return n;
								if (s.id === r) return n.push(s), n
							} else if (p && (s = p.getElementById(r)) && J(t, s) && s.id === r) return n.push(s), n
						} else {
							if (c[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
							if ((r = c[3]) && S.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(r)), n
						} if (S.qsa && !V[e + " "] && (!M || !M.test(e)) && (1 !== h || "object" !== t.nodeName.toLowerCase())) {
						if (d = e, p = t, 1 === h && (ue.test(e) || de.test(e))) {
							for ((p = be.test(e) && u(t.parentNode) || t) === t && S.scope || ((a = t.getAttribute("id")) ? a = a.replace(Ce, Te) : t.setAttribute("id", a = H)), o = (l = k(e)).length; o--;) l[o] = (a ? "#" + a : ":scope") + " " + f(l[o]);
							d = l.join(",")
						}
						try {
							return Z.apply(n, p.querySelectorAll(d)), n
						} catch (m) {
							V(e, !0)
						} finally {
							a === H && t.removeAttribute("id")
						}
					}
				}
				return E(e.replace(ce, "$1"), t, n, i)
			}

			function n() {
				function e(n, i) {
					return t.push(n + " ") > C.cacheLength && delete e[t.shift()], e[n + " "] = i
				}
				var t = [];
				return e
			}

			function i(e) {
				return e[H] = !0, e
			}

			function r(e) {
				var t = I.createElement("fieldset");
				try {
					return !!e(t)
				} catch (n) {
					return !1
				} finally {
					t.parentNode && t.parentNode.removeChild(t), t = null
				}
			}

			function o(e, t) {
				for (var n = e.split("|"), i = n.length; i--;) C.attrHandle[n[i]] = t
			}

			function s(e, t) {
				var n = t && e,
					i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
				if (i) return i;
				if (n)
					for (; n = n.nextSibling;)
						if (n === t) return -1;
				return e ? 1 : -1
			}

			function a(e) {
				return function (t) {
					return "input" === t.nodeName.toLowerCase() && t.type === e
				}
			}

			function c(e) {
				return function (t) {
					var n = t.nodeName.toLowerCase();
					return ("input" === n || "button" === n) && t.type === e
				}
			}

			function l(e) {
				return function (t) {
					return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ke(t) === e : t.disabled === e : "label" in t && t.disabled === e
				}
			}

			function d(e) {
				return i(function (t) {
					return t = +t, i(function (n, i) {
						for (var r, o = e([], n.length, t), s = o.length; s--;) n[r = o[s]] && (n[r] = !(i[r] = n[r]))
					})
				})
			}

			function u(e) {
				return e && "undefined" != typeof e.getElementsByTagName && e
			}

			function p() {}

			function f(e) {
				for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
				return i
			}

			function h(e, t, n) {
				var i = t.dir,
					r = t.next,
					o = r || i,
					s = n && "parentNode" === o,
					a = q++;
				return t.first ? function (t, n, r) {
					for (; t = t[i];)
						if (1 === t.nodeType || s) return e(t, n, r);
					return !1
				} : function (t, n, c) {
					var l, d, u, p = [B, a];
					if (c) {
						for (; t = t[i];)
							if ((1 === t.nodeType || s) && e(t, n, c)) return !0
					} else
						for (; t = t[i];)
							if (1 === t.nodeType || s)
								if (d = (u = t[H] || (t[H] = {}))[t.uniqueID] || (u[t.uniqueID] = {}), r && r === t.nodeName.toLowerCase()) t = t[i] || t;
								else {
									if ((l = d[o]) && l[0] === B && l[1] === a) return p[2] = l[2];
									if (d[o] = p, p[2] = e(t, n, c)) return !0
								} return !1
				}
			}

			function m(e) {
				return e.length > 1 ? function (t, n, i) {
					for (var r = e.length; r--;)
						if (!e[r](t, n, i)) return !1;
					return !0
				} : e[0]
			}

			function g(e, n, i) {
				for (var r = 0, o = n.length; r < o; r++) t(e, n[r], i);
				return i
			}

			function v(e, t, n, i, r) {
				for (var o, s = [], a = 0, c = e.length, l = null != t; a < c; a++)(o = e[a]) && (n && !n(o, i, r) || (s.push(o), l && t.push(a)));
				return s
			}

			function y(e, t, n, r, o, s) {
				return r && !r[H] && (r = y(r)), o && !o[H] && (o = y(o, s)), i(function (i, s, a, c) {
					var l, d, u, p = [],
						f = [],
						h = s.length,
						m = i || g(t || "*", a.nodeType ? [a] : a, []),
						y = !e || !i && t ? m : v(m, p, e, a, c),
						A = n ? o || (i ? e : h || r) ? [] : s : y;
					if (n && n(y, A, a, c), r)
						for (l = v(A, f), r(l, [], a, c), d = l.length; d--;)(u = l[d]) && (A[f[d]] = !(y[f[d]] = u));
					if (i) {
						if (o || e) {
							if (o) {
								for (l = [], d = A.length; d--;)(u = A[d]) && l.push(y[d] = u);
								o(null, A = [], l, c)
							}
							for (d = A.length; d--;)(u = A[d]) && (l = o ? te(i, u) : p[d]) > -1 && (i[l] = !(s[l] = u))
						}
					} else A = v(A === s ? A.splice(h, A.length) : A), o ? o(null, s, A, c) : Z.apply(s, A)
				})
			}

			function A(e) {
				for (var t, n, i, r = e.length, o = C.relative[e[0].type], s = o || C.relative[" "], a = o ? 1 : 0, c = h(function (e) {
						return e === t
					}, s, !0), l = h(function (e) {
						return te(t, e) > -1
					}, s, !0), d = [function (e, n, i) {
						var r = !o && (i || n !== P) || ((t = n).nodeType ? c(e, n, i) : l(e, n, i));
						return t = null, r
					}]; a < r; a++)
					if (n = C.relative[e[a].type]) d = [h(m(d), n)];
					else {
						if ((n = C.filter[e[a].type].apply(null, e[a].matches))[H]) {
							for (i = ++a; i < r && !C.relative[e[i].type]; i++);
							return y(a > 1 && m(d), a > 1 && f(e.slice(0, a - 1).concat({
								value: " " === e[a - 2].type ? "*" : ""
							})).replace(ce, "$1"), n, a < i && A(e.slice(a, i)), i < r && A(e = e.slice(i)), i < r && f(e))
						}
						d.push(n)
					} return m(d)
			}

			function b(e, n) {
				var r = n.length > 0,
					o = e.length > 0,
					s = function (i, s, a, c, l) {
						var d, u, p, f = 0,
							h = "0",
							m = i && [],
							g = [],
							y = P,
							A = i || o && C.find.TAG("*", l),
							b = B += null == y ? 1 : Math.random() || .1,
							w = A.length;
						for (l && (P = s == I || s || l); h !== w && null != (d = A[h]); h++) {
							if (o && d) {
								for (u = 0, s || d.ownerDocument == I || (R(d), a = !L); p = e[u++];)
									if (p(d, s || I, a)) {
										c.push(d);
										break
									} l && (B = b)
							}
							r && ((d = !p && d) && f--, i && m.push(d))
						}
						if (f += h, r && h !== f) {
							for (u = 0; p = n[u++];) p(m, g, s, a);
							if (i) {
								if (f > 0)
									for (; h--;) m[h] || g[h] || (g[h] = X.call(c));
								g = v(g)
							}
							Z.apply(c, g), l && !i && g.length > 0 && f + n.length > 1 && t.uniqueSort(c)
						}
						return l && (B = b, P = y), m
					};
				return r ? i(s) : s
			}
			var w, S, C, T, x, k, _, E, P, D, $, R, I, O, L, M, j, N, J, H = "sizzle" + 1 * new Date,
				F = e.document,
				B = 0,
				q = 0,
				z = n(),
				W = n(),
				U = n(),
				V = n(),
				G = function (e, t) {
					return e === t && ($ = !0), 0
				},
				Q = {}.hasOwnProperty,
				Y = [],
				X = Y.pop,
				K = Y.push,
				Z = Y.push,
				ee = Y.slice,
				te = function (e, t) {
					for (var n = 0, i = e.length; n < i; n++)
						if (e[n] === t) return n;
					return -1
				},
				ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
				ie = "[\\x20\\t\\r\\n\\f]",
				re = "(?:\\\\[\\da-fA-F]{1,6}" + ie + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
				oe = "\\[" + ie + "*(" + re + ")(?:" + ie + "*([*^$|!~]?=)" + ie + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ie + "*\\]",
				se = ":(" + re + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)",
				ae = new RegExp(ie + "+", "g"),
				ce = new RegExp("^" + ie + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ie + "+$", "g"),
				le = new RegExp("^" + ie + "*," + ie + "*"),
				de = new RegExp("^" + ie + "*([>+~]|" + ie + ")" + ie + "*"),
				ue = new RegExp(ie + "|>"),
				pe = new RegExp(se),
				fe = new RegExp("^" + re + "$"),
				he = {
					ID: new RegExp("^#(" + re + ")"),
					CLASS: new RegExp("^\\.(" + re + ")"),
					TAG: new RegExp("^(" + re + "|[*])"),
					ATTR: new RegExp("^" + oe),
					PSEUDO: new RegExp("^" + se),
					CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ie + "*(even|odd|(([+-]|)(\\d*)n|)" + ie + "*(?:([+-]|)" + ie + "*(\\d+)|))" + ie + "*\\)|)", "i"),
					bool: new RegExp("^(?:" + ne + ")$", "i"),
					needsContext: new RegExp("^" + ie + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ie + "*((?:-\\d)?\\d*)" + ie + "*\\)|)(?=[^-]|$)", "i")
				},
				me = /HTML$/i,
				ge = /^(?:input|select|textarea|button)$/i,
				ve = /^h\d$/i,
				ye = /^[^{]+\{\s*\[native \w/,
				Ae = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
				be = /[+~]/,
				we = new RegExp("\\\\[\\da-fA-F]{1,6}" + ie + "?|\\\\([^\\r\\n\\f])", "g"),
				Se = function (e, t) {
					var n = "0x" + e.slice(1) - 65536;
					return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
				},
				Ce = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
				Te = function (e, t) {
					return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
				},
				xe = function () {
					R()
				},
				ke = h(function (e) {
					return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
				}, {
					dir: "parentNode",
					next: "legend"
				});
			try {
				Z.apply(Y = ee.call(F.childNodes), F.childNodes), Y[F.childNodes.length].nodeType
			} catch (_e) {
				Z = {
					apply: Y.length ? function (e, t) {
						K.apply(e, ee.call(t))
					} : function (e, t) {
						for (var n = e.length, i = 0; e[n++] = t[i++];);
						e.length = n - 1
					}
				}
			}
			for (w in S = t.support = {}, x = t.isXML = function (e) {
					var t = e.namespaceURI,
						n = (e.ownerDocument || e).documentElement;
					return !me.test(t || n && n.nodeName || "HTML")
				}, R = t.setDocument = function (e) {
					var t, n, i = e ? e.ownerDocument || e : F;
					return i != I && 9 === i.nodeType && i.documentElement ? (O = (I = i).documentElement, L = !x(I), F != I && (n = I.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", xe, !1) : n.attachEvent && n.attachEvent("onunload", xe)), S.scope = r(function (e) {
						return O.appendChild(e).appendChild(I.createElement("div")), "undefined" != typeof e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
					}), S.attributes = r(function (e) {
						return e.className = "i", !e.getAttribute("className")
					}), S.getElementsByTagName = r(function (e) {
						return e.appendChild(I.createComment("")), !e.getElementsByTagName("*").length
					}), S.getElementsByClassName = ye.test(I.getElementsByClassName), S.getById = r(function (e) {
						return O.appendChild(e).id = H, !I.getElementsByName || !I.getElementsByName(H).length
					}), S.getById ? (C.filter.ID = function (e) {
						var t = e.replace(we, Se);
						return function (e) {
							return e.getAttribute("id") === t
						}
					}, C.find.ID = function (e, t) {
						if ("undefined" != typeof t.getElementById && L) {
							var n = t.getElementById(e);
							return n ? [n] : []
						}
					}) : (C.filter.ID = function (e) {
						var t = e.replace(we, Se);
						return function (e) {
							var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
							return n && n.value === t
						}
					}, C.find.ID = function (e, t) {
						if ("undefined" != typeof t.getElementById && L) {
							var n, i, r, o = t.getElementById(e);
							if (o) {
								if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
								for (r = t.getElementsByName(e), i = 0; o = r[i++];)
									if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
							}
							return []
						}
					}), C.find.TAG = S.getElementsByTagName ? function (e, t) {
						return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : S.qsa ? t.querySelectorAll(e) : void 0
					} : function (e, t) {
						var n, i = [],
							r = 0,
							o = t.getElementsByTagName(e);
						if ("*" === e) {
							for (; n = o[r++];) 1 === n.nodeType && i.push(n);
							return i
						}
						return o
					}, C.find.CLASS = S.getElementsByClassName && function (e, t) {
						if ("undefined" != typeof t.getElementsByClassName && L) return t.getElementsByClassName(e)
					}, j = [], M = [], (S.qsa = ye.test(I.querySelectorAll)) && (r(function (e) {
						var t;
						O.appendChild(e).innerHTML = "<a id='" + H + "'></a><select id='" + H + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && M.push("[*^$]=" + ie + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || M.push("\\[" + ie + "*(?:value|" + ne + ")"), e.querySelectorAll("[id~=" + H + "-]").length || M.push("~="), (t = I.createElement("input")).setAttribute("name", ""), e.appendChild(t), e.querySelectorAll("[name='']").length || M.push("\\[" + ie + "*name" + ie + "*=" + ie + "*(?:''|\"\")"), e.querySelectorAll(":checked").length || M.push(":checked"), e.querySelectorAll("a#" + H + "+*").length || M.push(".#.+[+~]"), e.querySelectorAll("\\\f"), M.push("[\\r\\n\\f]")
					}), r(function (e) {
						e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
						var t = I.createElement("input");
						t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && M.push("name" + ie + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && M.push(":enabled", ":disabled"), O.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && M.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), M.push(",.*:")
					})), (S.matchesSelector = ye.test(N = O.matches || O.webkitMatchesSelector || O.mozMatchesSelector || O.oMatchesSelector || O.msMatchesSelector)) && r(function (e) {
						S.disconnectedMatch = N.call(e, "*"), N.call(e, "[s!='']:x"), j.push("!=", se)
					}), M = M.length && new RegExp(M.join("|")), j = j.length && new RegExp(j.join("|")), t = ye.test(O.compareDocumentPosition), J = t || ye.test(O.contains) ? function (e, t) {
						var n = 9 === e.nodeType ? e.documentElement : e,
							i = t && t.parentNode;
						return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
					} : function (e, t) {
						if (t)
							for (; t = t.parentNode;)
								if (t === e) return !0;
						return !1
					}, G = t ? function (e, t) {
						if (e === t) return $ = !0, 0;
						var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
						return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !S.sortDetached && t.compareDocumentPosition(e) === n ? e == I || e.ownerDocument == F && J(F, e) ? -1 : t == I || t.ownerDocument == F && J(F, t) ? 1 : D ? te(D, e) - te(D, t) : 0 : 4 & n ? -1 : 1)
					} : function (e, t) {
						if (e === t) return $ = !0, 0;
						var n, i = 0,
							r = e.parentNode,
							o = t.parentNode,
							a = [e],
							c = [t];
						if (!r || !o) return e == I ? -1 : t == I ? 1 : r ? -1 : o ? 1 : D ? te(D, e) - te(D, t) : 0;
						if (r === o) return s(e, t);
						for (n = e; n = n.parentNode;) a.unshift(n);
						for (n = t; n = n.parentNode;) c.unshift(n);
						for (; a[i] === c[i];) i++;
						return i ? s(a[i], c[i]) : a[i] == F ? -1 : c[i] == F ? 1 : 0
					}, I) : I
				}, t.matches = function (e, n) {
					return t(e, null, null, n)
				}, t.matchesSelector = function (e, n) {
					if (R(e), S.matchesSelector && L && !V[n + " "] && (!j || !j.test(n)) && (!M || !M.test(n))) try {
						var i = N.call(e, n);
						if (i || S.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
					} catch (_e) {
						V(n, !0)
					}
					return t(n, I, null, [e]).length > 0
				}, t.contains = function (e, t) {
					return (e.ownerDocument || e) != I && R(e), J(e, t)
				}, t.attr = function (e, t) {
					(e.ownerDocument || e) != I && R(e);
					var n = C.attrHandle[t.toLowerCase()],
						i = n && Q.call(C.attrHandle, t.toLowerCase()) ? n(e, t, !L) : undefined;
					return i !== undefined ? i : S.attributes || !L ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
				}, t.escape = function (e) {
					return (e + "").replace(Ce, Te)
				}, t.error = function (e) {
					throw new Error("Syntax error, unrecognized expression: " + e)
				}, t.uniqueSort = function (e) {
					var t, n = [],
						i = 0,
						r = 0;
					if ($ = !S.detectDuplicates, D = !S.sortStable && e.slice(0), e.sort(G), $) {
						for (; t = e[r++];) t === e[r] && (i = n.push(r));
						for (; i--;) e.splice(n[i], 1)
					}
					return D = null, e
				}, T = t.getText = function (e) {
					var t, n = "",
						i = 0,
						r = e.nodeType;
					if (r) {
						if (1 === r || 9 === r || 11 === r) {
							if ("string" == typeof e.textContent) return e.textContent;
							for (e = e.firstChild; e; e = e.nextSibling) n += T(e)
						} else if (3 === r || 4 === r) return e.nodeValue
					} else
						for (; t = e[i++];) n += T(t);
					return n
				}, (C = t.selectors = {
					cacheLength: 50,
					createPseudo: i,
					match: he,
					attrHandle: {},
					find: {},
					relative: {
						">": {
							dir: "parentNode",
							first: !0
						},
						" ": {
							dir: "parentNode"
						},
						"+": {
							dir: "previousSibling",
							first: !0
						},
						"~": {
							dir: "previousSibling"
						}
					},
					preFilter: {
						ATTR: function (e) {
							return e[1] = e[1].replace(we, Se), e[3] = (e[3] || e[4] || e[5] || "").replace(we, Se), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
						},
						CHILD: function (e) {
							return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
						},
						PSEUDO: function (e) {
							var t, n = !e[6] && e[2];
							return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = k(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
						}
					},
					filter: {
						TAG: function (e) {
							var t = e.replace(we, Se).toLowerCase();
							return "*" === e ? function () {
								return !0
							} : function (e) {
								return e.nodeName && e.nodeName.toLowerCase() === t
							}
						},
						CLASS: function (e) {
							var t = z[e + " "];
							return t || (t = new RegExp("(^|" + ie + ")" + e + "(" + ie + "|$)")) && z(e, function (e) {
								return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
							})
						},
						ATTR: function (e, n, i) {
							return function (r) {
								var o = t.attr(r, e);
								return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(i) > -1 : "|=" === n && (o === i || o.slice(0, i.length + 1) === i + "-"))
							}
						},
						CHILD: function (e, t, n, i, r) {
							var o = "nth" !== e.slice(0, 3),
								s = "last" !== e.slice(-4),
								a = "of-type" === t;
							return 1 === i && 0 === r ? function (e) {
								return !!e.parentNode
							} : function (t, n, c) {
								var l, d, u, p, f, h, m = o !== s ? "nextSibling" : "previousSibling",
									g = t.parentNode,
									v = a && t.nodeName.toLowerCase(),
									y = !c && !a,
									A = !1;
								if (g) {
									if (o) {
										for (; m;) {
											for (p = t; p = p[m];)
												if (a ? p.nodeName.toLowerCase() === v : 1 === p.nodeType) return !1;
											h = m = "only" === e && !h && "nextSibling"
										}
										return !0
									}
									if (h = [s ? g.firstChild : g.lastChild], s && y) {
										for (A = (f = (l = (d = (u = (p = g)[H] || (p[H] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === B && l[1]) && l[2], p = f && g.childNodes[f]; p = ++f && p && p[m] || (A = f = 0) || h.pop();)
											if (1 === p.nodeType && ++A && p === t) {
												d[e] = [B, f, A];
												break
											}
									} else if (y && (A = f = (l = (d = (u = (p = t)[H] || (p[H] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === B && l[1]), !1 === A)
										for (;
											(p = ++f && p && p[m] || (A = f = 0) || h.pop()) && ((a ? p.nodeName.toLowerCase() !== v : 1 !== p.nodeType) || !++A || (y && ((d = (u = p[H] || (p[H] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] = [B, A]), p !== t)););
									return (A -= r) === i || A % i == 0 && A / i >= 0
								}
							}
						},
						PSEUDO: function (e, n) {
							var r, o = C.pseudos[e] || C.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
							return o[H] ? o(n) : o.length > 1 ? (r = [e, e, "", n], C.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
								for (var i, r = o(e, n), s = r.length; s--;) e[i = te(e, r[s])] = !(t[i] = r[s])
							}) : function (e) {
								return o(e, 0, r)
							}) : o
						}
					},
					pseudos: {
						not: i(function (e) {
							var t = [],
								n = [],
								r = _(e.replace(ce, "$1"));
							return r[H] ? i(function (e, t, n, i) {
								for (var o, s = r(e, null, i, []), a = e.length; a--;)(o = s[a]) && (e[a] = !(t[a] = o))
							}) : function (e, i, o) {
								return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
							}
						}),
						has: i(function (e) {
							return function (n) {
								return t(e, n).length > 0
							}
						}),
						contains: i(function (e) {
							return e = e.replace(we, Se),
								function (t) {
									return (t.textContent || T(t)).indexOf(e) > -1
								}
						}),
						lang: i(function (e) {
							return fe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(we, Se).toLowerCase(),
								function (t) {
									var n;
									do {
										if (n = L ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
									} while ((t = t.parentNode) && 1 === t.nodeType);
									return !1
								}
						}),
						target: function (t) {
							var n = e.location && e.location.hash;
							return n && n.slice(1) === t.id
						},
						root: function (e) {
							return e === O
						},
						focus: function (e) {
							return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
						},
						enabled: l(!1),
						disabled: l(!0),
						checked: function (e) {
							var t = e.nodeName.toLowerCase();
							return "input" === t && !!e.checked || "option" === t && !!e.selected
						},
						selected: function (e) {
							return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
						},
						empty: function (e) {
							for (e = e.firstChild; e; e = e.nextSibling)
								if (e.nodeType < 6) return !1;
							return !0
						},
						parent: function (e) {
							return !C.pseudos.empty(e)
						},
						header: function (e) {
							return ve.test(e.nodeName)
						},
						input: function (e) {
							return ge.test(e.nodeName)
						},
						button: function (e) {
							var t = e.nodeName.toLowerCase();
							return "input" === t && "button" === e.type || "button" === t
						},
						text: function (e) {
							var t;
							return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
						},
						first: d(function () {
							return [0]
						}),
						last: d(function (e, t) {
							return [t - 1]
						}),
						eq: d(function (e, t, n) {
							return [n < 0 ? n + t : n]
						}),
						even: d(function (e, t) {
							for (var n = 0; n < t; n += 2) e.push(n);
							return e
						}),
						odd: d(function (e, t) {
							for (var n = 1; n < t; n += 2) e.push(n);
							return e
						}),
						lt: d(function (e, t, n) {
							for (var i = n < 0 ? n + t : n > t ? t : n; --i >= 0;) e.push(i);
							return e
						}),
						gt: d(function (e, t, n) {
							for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
							return e
						})
					}
				}).pseudos.nth = C.pseudos.eq, {
					radio: !0,
					checkbox: !0,
					file: !0,
					password: !0,
					image: !0
				}) C.pseudos[w] = a(w);
			for (w in {
					submit: !0,
					reset: !0
				}) C.pseudos[w] = c(w);
			return p.prototype = C.filters = C.pseudos, C.setFilters = new p, k = t.tokenize = function (e, n) {
				var i, r, o, s, a, c, l, d = W[e + " "];
				if (d) return n ? 0 : d.slice(0);
				for (a = e, c = [], l = C.preFilter; a;) {
					for (s in i && !(r = le.exec(a)) || (r && (a = a.slice(r[0].length) || a), c.push(o = [])), i = !1, (r = de.exec(a)) && (i = r.shift(), o.push({
							value: i,
							type: r[0].replace(ce, " ")
						}), a = a.slice(i.length)), C.filter) !(r = he[s].exec(a)) || l[s] && !(r = l[s](r)) || (i = r.shift(), o.push({
						value: i,
						type: s,
						matches: r
					}), a = a.slice(i.length));
					if (!i) break
				}
				return n ? a.length : a ? t.error(e) : W(e, c).slice(0)
			}, _ = t.compile = function (e, t) {
				var n, i = [],
					r = [],
					o = U[e + " "];
				if (!o) {
					for (t || (t = k(e)), n = t.length; n--;)(o = A(t[n]))[H] ? i.push(o) : r.push(o);
					(o = U(e, b(r, i))).selector = e
				}
				return o
			}, E = t.select = function (e, t, n, i) {
				var r, o, s, a, c, l = "function" == typeof e && e,
					d = !i && k(e = l.selector || e);
				if (n = n || [], 1 === d.length) {
					if ((o = d[0] = d[0].slice(0)).length > 2 && "ID" === (s = o[0]).type && 9 === t.nodeType && L && C.relative[o[1].type]) {
						if (!(t = (C.find.ID(s.matches[0].replace(we, Se), t) || [])[0])) return n;
						l && (t = t.parentNode), e = e.slice(o.shift().value.length)
					}
					for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (s = o[r], !C.relative[a = s.type]);)
						if ((c = C.find[a]) && (i = c(s.matches[0].replace(we, Se), be.test(o[0].type) && u(t.parentNode) || t))) {
							if (o.splice(r, 1), !(e = i.length && f(o))) return Z.apply(n, i), n;
							break
						}
				}
				return (l || _(e, d))(i, t, !L, n, !t || be.test(e) && u(t.parentNode) || t), n
			}, S.sortStable = H.split("").sort(G).join("") === H, S.detectDuplicates = !!$, R(), S.sortDetached = r(function (e) {
				return 1 & e.compareDocumentPosition(I.createElement("fieldset"))
			}), r(function (e) {
				return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
			}) || o("type|href|height|width", function (e, t, n) {
				if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
			}), S.attributes && r(function (e) {
				return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
			}) || o("value", function (e, t, n) {
				if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
			}), r(function (e) {
				return null == e.getAttribute("disabled")
			}) || o(ne, function (e, t, n) {
				var i;
				if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
			}), t
		}(e);
	Te.find = xe, Te.expr = xe.selectors, Te.expr[":"] = Te.expr.pseudos, Te.uniqueSort = Te.unique = xe.uniqueSort, Te.text = xe.getText, Te.isXMLDoc = xe.isXML, Te.contains = xe.contains, Te.escapeSelector = xe.escape;
	var ke = function (e, t, n) {
			for (var i = [], r = n !== undefined;
				(e = e[t]) && 9 !== e.nodeType;)
				if (1 === e.nodeType) {
					if (r && Te(e).is(n)) break;
					i.push(e)
				} return i
		},
		_e = function (e, t) {
			for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
			return n
		},
		Ee = Te.expr.match.needsContext,
		Pe = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
	Te.filter = function (e, t, n) {
		var i = t[0];
		return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? Te.find.matchesSelector(i, e) ? [i] : [] : Te.find.matches(e, Te.grep(t, function (e) {
			return 1 === e.nodeType
		}))
	}, Te.fn.extend({
		find: function (e) {
			var t, n, i = this.length,
				r = this;
			if ("string" != typeof e) return this.pushStack(Te(e).filter(function () {
				for (t = 0; t < i; t++)
					if (Te.contains(r[t], this)) return !0
			}));
			for (n = this.pushStack([]), t = 0; t < i; t++) Te.find(e, r[t], n);
			return i > 1 ? Te.uniqueSort(n) : n
		},
		filter: function (e) {
			return this.pushStack(s(this, e || [], !1))
		},
		not: function (e) {
			return this.pushStack(s(this, e || [], !0))
		},
		is: function (e) {
			return !!s(this, "string" == typeof e && Ee.test(e) ? Te(e) : e || [], !1).length
		}
	});
	var De, $e = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
	(Te.fn.init = function (e, t, n) {
		var i, r;
		if (!e) return this;
		if (n = n || De, "string" == typeof e) {
			if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : $e.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
			if (i[1]) {
				if (t = t instanceof Te ? t[0] : t, Te.merge(this, Te.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : we, !0)), Pe.test(i[1]) && Te.isPlainObject(t))
					for (i in t) Ae(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
				return this
			}
			return (r = we.getElementById(i[2])) && (this[0] = r, this.length = 1), this
		}
		return e.nodeType ? (this[0] = e, this.length = 1, this) : Ae(e) ? n.ready !== undefined ? n.ready(e) : e(Te) : Te.makeArray(e, this)
	}).prototype = Te.fn, De = Te(we);
	var Re = /^(?:parents|prev(?:Until|All))/,
		Ie = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	Te.fn.extend({
		has: function (e) {
			var t = Te(e, this),
				n = t.length;
			return this.filter(function () {
				for (var e = 0; e < n; e++)
					if (Te.contains(this, t[e])) return !0
			})
		},
		closest: function (e, t) {
			var n, i = 0,
				r = this.length,
				o = [],
				s = "string" != typeof e && Te(e);
			if (!Ee.test(e))
				for (; i < r; i++)
					for (n = this[i]; n && n !== t; n = n.parentNode)
						if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && Te.find.matchesSelector(n, e))) {
							o.push(n);
							break
						} return this.pushStack(o.length > 1 ? Te.uniqueSort(o) : o)
		},
		index: function (e) {
			return e ? "string" == typeof e ? pe.call(Te(e), this[0]) : pe.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add: function (e, t) {
			return this.pushStack(Te.uniqueSort(Te.merge(this.get(), Te(e, t))))
		},
		addBack: function (e) {
			return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
		}
	}), Te.each({
		parent: function (e) {
			var t = e.parentNode;
			return t && 11 !== t.nodeType ? t : null
		},
		parents: function (e) {
			return ke(e, "parentNode")
		},
		parentsUntil: function (e, t, n) {
			return ke(e, "parentNode", n)
		},
		next: function (e) {
			return a(e, "nextSibling")
		},
		prev: function (e) {
			return a(e, "previousSibling")
		},
		nextAll: function (e) {
			return ke(e, "nextSibling")
		},
		prevAll: function (e) {
			return ke(e, "previousSibling")
		},
		nextUntil: function (e, t, n) {
			return ke(e, "nextSibling", n)
		},
		prevUntil: function (e, t, n) {
			return ke(e, "previousSibling", n)
		},
		siblings: function (e) {
			return _e((e.parentNode || {}).firstChild, e)
		},
		children: function (e) {
			return _e(e.firstChild)
		},
		contents: function (e) {
			return null != e.contentDocument && ce(e.contentDocument) ? e.contentDocument : (o(e, "template") && (e = e.content || e), Te.merge([], e.childNodes))
		}
	}, function (e, t) {
		Te.fn[e] = function (n, i) {
			var r = Te.map(this, t, n);
			return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = Te.filter(i, r)), this.length > 1 && (Ie[e] || Te.uniqueSort(r), Re.test(e) && r.reverse()), this.pushStack(r)
		}
	});
	var Oe = /[^\x20\t\r\n\f]+/g;
	Te.Callbacks = function (e) {
		e = "string" == typeof e ? c(e) : Te.extend({}, e);
		var t, n, r, o, s = [],
			a = [],
			l = -1,
			d = function () {
				for (o = o || e.once, r = t = !0; a.length; l = -1)
					for (n = a.shift(); ++l < s.length;) !1 === s[l].apply(n[0], n[1]) && e.stopOnFalse && (l = s.length, n = !1);
				e.memory || (n = !1), t = !1, o && (s = n ? [] : "")
			},
			u = {
				add: function () {
					return s && (n && !t && (l = s.length - 1, a.push(n)), function r(t) {
						Te.each(t, function (t, n) {
							Ae(n) ? e.unique && u.has(n) || s.push(n) : n && n.length && "string" !== i(n) && r(n)
						})
					}(arguments), n && !t && d()), this
				},
				remove: function () {
					return Te.each(arguments, function (e, t) {
						for (var n;
							(n = Te.inArray(t, s, n)) > -1;) s.splice(n, 1), n <= l && l--
					}), this
				},
				has: function (e) {
					return e ? Te.inArray(e, s) > -1 : s.length > 0
				},
				empty: function () {
					return s && (s = []), this
				},
				disable: function () {
					return o = a = [], s = n = "", this
				},
				disabled: function () {
					return !s
				},
				lock: function () {
					return o = a = [], n || t || (s = n = ""), this
				},
				locked: function () {
					return !!o
				},
				fireWith: function (e, n) {
					return o || (n = [e, (n = n || []).slice ? n.slice() : n], a.push(n), t || d()), this
				},
				fire: function () {
					return u.fireWith(this, arguments), this
				},
				fired: function () {
					return !!r
				}
			};
		return u
	}, Te.extend({
		Deferred: function (t) {
			var n = [
					["notify", "progress", Te.Callbacks("memory"), Te.Callbacks("memory"), 2],
					["resolve", "done", Te.Callbacks("once memory"), Te.Callbacks("once memory"), 0, "resolved"],
					["reject", "fail", Te.Callbacks("once memory"), Te.Callbacks("once memory"), 1, "rejected"]
				],
				i = "pending",
				r = {
					state: function () {
						return i
					},
					always: function () {
						return o.done(arguments).fail(arguments), this
					},
					"catch": function (e) {
						return r.then(null, e)
					},
					pipe: function () {
						var e = arguments;
						return Te.Deferred(function (t) {
							Te.each(n, function (n, i) {
								var r = Ae(e[i[4]]) && e[i[4]];
								o[i[1]](function () {
									var e = r && r.apply(this, arguments);
									e && Ae(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, r ? [e] : arguments)
								})
							}), e = null
						}).promise()
					},
					then: function (t, i, r) {
						function o(t, n, i, r) {
							return function () {
								var a = this,
									c = arguments,
									u = function () {
										var e, u;
										if (!(t < s)) {
											if ((e = i.apply(a, c)) === n.promise()) throw new TypeError("Thenable self-resolution");
											u = e && ("object" == typeof e || "function" == typeof e) && e.then, Ae(u) ? r ? u.call(e, o(s, n, l, r), o(s, n, d, r)) : (s++, u.call(e, o(s, n, l, r), o(s, n, d, r), o(s, n, l, n.notifyWith))) : (i !== l && (a = undefined, c = [e]), (r || n.resolveWith)(a, c))
										}
									},
									p = r ? u : function () {
										try {
											u()
										} catch (e) {
											Te.Deferred.exceptionHook && Te.Deferred.exceptionHook(e, p.stackTrace), t + 1 >= s && (i !== d && (a = undefined, c = [e]), n.rejectWith(a, c))
										}
									};
								t ? p() : (Te.Deferred.getStackHook && (p.stackTrace = Te.Deferred.getStackHook()), e.setTimeout(p))
							}
						}
						var s = 0;
						return Te.Deferred(function (e) {
							n[0][3].add(o(0, e, Ae(r) ? r : l, e.notifyWith)), n[1][3].add(o(0, e, Ae(t) ? t : l)), n[2][3].add(o(0, e, Ae(i) ? i : d))
						}).promise()
					},
					promise: function (e) {
						return null != e ? Te.extend(e, r) : r
					}
				},
				o = {};
			return Te.each(n, function (e, t) {
				var s = t[2],
					a = t[5];
				r[t[1]] = s.add, a && s.add(function () {
					i = a
				}, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), s.add(t[3].fire), o[t[0]] = function () {
					return o[t[0] + "With"](this === o ? undefined : this, arguments), this
				}, o[t[0] + "With"] = s.fireWith
			}), r.promise(o), t && t.call(o, o), o
		},
		when: function (e) {
			var t = arguments.length,
				n = t,
				i = Array(n),
				r = le.call(arguments),
				o = Te.Deferred(),
				s = function (e) {
					return function (n) {
						i[e] = this, r[e] = arguments.length > 1 ? le.call(arguments) : n, --t || o.resolveWith(i, r)
					}
				};
			if (t <= 1 && (u(e, o.done(s(n)).resolve, o.reject, !t), "pending" === o.state() || Ae(r[n] && r[n].then))) return o.then();
			for (; n--;) u(r[n], s(n), o.reject);
			return o.promise()
		}
	});
	var Le = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
	Te.Deferred.exceptionHook = function (t, n) {
		e.console && e.console.warn && t && Le.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
	}, Te.readyException = function (t) {
		e.setTimeout(function () {
			throw t
		})
	};
	var Me = Te.Deferred();
	Te.fn.ready = function (e) {
		return Me.then(e)["catch"](function (e) {
			Te.readyException(e)
		}), this
	}, Te.extend({
		isReady: !1,
		readyWait: 1,
		ready: function (e) {
			(!0 === e ? --Te.readyWait : Te.isReady) || (Te.isReady = !0, !0 !== e && --Te.readyWait > 0 || Me.resolveWith(we, [Te]))
		}
	}), Te.ready.then = Me.then, "complete" === we.readyState || "loading" !== we.readyState && !we.documentElement.doScroll ? e.setTimeout(Te.ready) : (we.addEventListener("DOMContentLoaded", p), e.addEventListener("load", p));
	var je = function (e, t, n, r, o, s, a) {
			var c = 0,
				l = e.length,
				d = null == n;
			if ("object" === i(n))
				for (c in o = !0, n) je(e, t, c, n[c], !0, s, a);
			else if (r !== undefined && (o = !0, Ae(r) || (a = !0), d && (a ? (t.call(e, r), t = null) : (d = t, t = function (e, t, n) {
					return d.call(Te(e), n)
				})), t))
				for (; c < l; c++) t(e[c], n, a ? r : r.call(e[c], c, t(e[c], n)));
			return o ? e : d ? t.call(e) : l ? t(e[0], n) : s
		},
		Ne = /^-ms-/,
		Je = /-([a-z])/g,
		He = function (e) {
			return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
		};
	m.uid = 1, m.prototype = {
		cache: function (e) {
			var t = e[this.expando];
			return t || (t = {}, He(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
				value: t,
				configurable: !0
			}))), t
		},
		set: function (e, t, n) {
			var i, r = this.cache(e);
			if ("string" == typeof t) r[h(t)] = n;
			else
				for (i in t) r[h(i)] = t[i];
			return r
		},
		get: function (e, t) {
			return t === undefined ? this.cache(e) : e[this.expando] && e[this.expando][h(t)]
		},
		access: function (e, t, n) {
			return t === undefined || t && "string" == typeof t && n === undefined ? this.get(e, t) : (this.set(e, t, n), n !== undefined ? n : t)
		},
		remove: function (e, t) {
			var n, i = e[this.expando];
			if (i !== undefined) {
				if (t !== undefined) {
					n = (t = Array.isArray(t) ? t.map(h) : (t = h(t)) in i ? [t] : t.match(Oe) || []).length;
					for (; n--;) delete i[t[n]]
				}(t === undefined || Te.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = undefined : delete e[this.expando])
			}
		},
		hasData: function (e) {
			var t = e[this.expando];
			return t !== undefined && !Te.isEmptyObject(t)
		}
	};
	var Fe = new m,
		Be = new m,
		qe = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		ze = /[A-Z]/g;
	Te.extend({
		hasData: function (e) {
			return Be.hasData(e) || Fe.hasData(e)
		},
		data: function (e, t, n) {
			return Be.access(e, t, n)
		},
		removeData: function (e, t) {
			Be.remove(e, t)
		},
		_data: function (e, t, n) {
			return Fe.access(e, t, n)
		},
		_removeData: function (e, t) {
			Fe.remove(e, t)
		}
	}), Te.fn.extend({
		data: function (e, t) {
			var n, i, r, o = this[0],
				s = o && o.attributes;
			if (e === undefined) {
				if (this.length && (r = Be.get(o), 1 === o.nodeType && !Fe.get(o, "hasDataAttrs"))) {
					for (n = s.length; n--;) s[n] && 0 === (i = s[n].name).indexOf("data-") && (i = h(i.slice(5)), v(o, i, r[i]));
					Fe.set(o, "hasDataAttrs", !0)
				}
				return r
			}
			return "object" == typeof e ? this.each(function () {
				Be.set(this, e)
			}) : je(this, function (t) {
				var n;
				if (o && t === undefined) return (n = Be.get(o, e)) !== undefined ? n : (n = v(o, e)) !== undefined ? n : void 0;
				this.each(function () {
					Be.set(this, e, t)
				})
			}, null, t, arguments.length > 1, null, !0)
		},
		removeData: function (e) {
			return this.each(function () {
				Be.remove(this, e)
			})
		}
	}), Te.extend({
		queue: function (e, t, n) {
			var i;
			if (e) return t = (t || "fx") + "queue", i = Fe.get(e, t), n && (!i || Array.isArray(n) ? i = Fe.access(e, t, Te.makeArray(n)) : i.push(n)), i || []
		},
		dequeue: function (e, t) {
			t = t || "fx";
			var n = Te.queue(e, t),
				i = n.length,
				r = n.shift(),
				o = Te._queueHooks(e, t),
				s = function () {
					Te.dequeue(e, t)
				};
			"inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, s, o)), !i && o && o.empty.fire()
		},
		_queueHooks: function (e, t) {
			var n = t + "queueHooks";
			return Fe.get(e, n) || Fe.access(e, n, {
				empty: Te.Callbacks("once memory").add(function () {
					Fe.remove(e, [t + "queue", n])
				})
			})
		}
	}), Te.fn.extend({
		queue: function (e, t) {
			var n = 2;
			return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? Te.queue(this[0], e) : t === undefined ? this : this.each(function () {
				var n = Te.queue(this, e, t);
				Te._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && Te.dequeue(this, e)
			})
		},
		dequeue: function (e) {
			return this.each(function () {
				Te.dequeue(this, e)
			})
		},
		clearQueue: function (e) {
			return this.queue(e || "fx", [])
		},
		promise: function (e, t) {
			var n, i = 1,
				r = Te.Deferred(),
				o = this,
				s = this.length,
				a = function () {
					--i || r.resolveWith(o, [o])
				};
			for ("string" != typeof e && (t = e, e = undefined), e = e || "fx"; s--;)(n = Fe.get(o[s], e + "queueHooks")) && n.empty && (i++, n.empty.add(a));
			return a(), r.promise(t)
		}
	});
	var We = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		Ue = new RegExp("^(?:([+-])=|)(" + We + ")([a-z%]*)$", "i"),
		Ve = ["Top", "Right", "Bottom", "Left"],
		Ge = we.documentElement,
		Qe = function (e) {
			return Te.contains(e.ownerDocument, e)
		},
		Ye = {
			composed: !0
		};
	Ge.getRootNode && (Qe = function (e) {
		return Te.contains(e.ownerDocument, e) || e.getRootNode(Ye) === e.ownerDocument
	});
	var Xe = function (e, t) {
			return "none" === (e = t || e).style.display || "" === e.style.display && Qe(e) && "none" === Te.css(e, "display")
		},
		Ke = {};
	Te.fn.extend({
		show: function () {
			return b(this, !0)
		},
		hide: function () {
			return b(this)
		},
		toggle: function (e) {
			return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
				Xe(this) ? Te(this).show() : Te(this).hide()
			})
		}
	});
	var Ze, et, tt = /^(?:checkbox|radio)$/i,
		nt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
		it = /^$|^module$|\/(?:java|ecma)script/i;
	Ze = we.createDocumentFragment().appendChild(we.createElement("div")), (et = we.createElement("input")).setAttribute("type", "radio"), et.setAttribute("checked", "checked"), et.setAttribute("name", "t"), Ze.appendChild(et), ye.checkClone = Ze.cloneNode(!0).cloneNode(!0).lastChild.checked, Ze.innerHTML = "<textarea>x</textarea>", ye.noCloneChecked = !!Ze.cloneNode(!0).lastChild.defaultValue, Ze.innerHTML = "<option></option>", ye.option = !!Ze.lastChild;
	var rt = {
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default: [0, "", ""]
	};
	rt.tbody = rt.tfoot = rt.colgroup = rt.caption = rt.thead,
		rt.th = rt.td, ye.option || (rt.optgroup = rt.option = [1, "<select multiple='multiple'>", "</select>"]);
	var ot = /<|&#?\w+;/,
		st = /^key/,
		at = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		ct = /^([^.]*)(?:\.(.+)|)/;
	Te.event = {
		global: {},
		add: function (e, t, n, i, r) {
			var o, s, a, c, l, d, u, p, f, h, m, g = Fe.get(e);
			if (He(e))
				for (n.handler && (n = (o = n).handler, r = o.selector), r && Te.find.matchesSelector(Ge, r), n.guid || (n.guid = Te.guid++), (c = g.events) || (c = g.events = Object.create(null)), (s = g.handle) || (s = g.handle = function (t) {
						return void 0 !== Te && Te.event.triggered !== t.type ? Te.event.dispatch.apply(e, arguments) : undefined
					}), l = (t = (t || "").match(Oe) || [""]).length; l--;) f = m = (a = ct.exec(t[l]) || [])[1], h = (a[2] || "").split(".").sort(), f && (u = Te.event.special[f] || {}, f = (r ? u.delegateType : u.bindType) || f, u = Te.event.special[f] || {}, d = Te.extend({
					type: f,
					origType: m,
					data: i,
					handler: n,
					guid: n.guid,
					selector: r,
					needsContext: r && Te.expr.match.needsContext.test(r),
					namespace: h.join(".")
				}, o), (p = c[f]) || ((p = c[f] = []).delegateCount = 0, u.setup && !1 !== u.setup.call(e, i, h, s) || e.addEventListener && e.addEventListener(f, s)), u.add && (u.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), r ? p.splice(p.delegateCount++, 0, d) : p.push(d), Te.event.global[f] = !0)
		},
		remove: function (e, t, n, i, r) {
			var o, s, a, c, l, d, u, p, f, h, m, g = Fe.hasData(e) && Fe.get(e);
			if (g && (c = g.events)) {
				for (l = (t = (t || "").match(Oe) || [""]).length; l--;)
					if (f = m = (a = ct.exec(t[l]) || [])[1], h = (a[2] || "").split(".").sort(), f) {
						for (u = Te.event.special[f] || {}, p = c[f = (i ? u.delegateType : u.bindType) || f] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = o = p.length; o--;) d = p[o], !r && m !== d.origType || n && n.guid !== d.guid || a && !a.test(d.namespace) || i && i !== d.selector && ("**" !== i || !d.selector) || (p.splice(o, 1), d.selector && p.delegateCount--, u.remove && u.remove.call(e, d));
						s && !p.length && (u.teardown && !1 !== u.teardown.call(e, h, g.handle) || Te.removeEvent(e, f, g.handle), delete c[f])
					} else
						for (f in c) Te.event.remove(e, f + t[l], n, i, !0);
				Te.isEmptyObject(c) && Fe.remove(e, "handle events")
			}
		},
		dispatch: function (e) {
			var t, n, i, r, o, s, a = new Array(arguments.length),
				c = Te.event.fix(e),
				l = (Fe.get(this, "events") || Object.create(null))[c.type] || [],
				d = Te.event.special[c.type] || {};
			for (a[0] = c, t = 1; t < arguments.length; t++) a[t] = arguments[t];
			if (c.delegateTarget = this, !d.preDispatch || !1 !== d.preDispatch.call(this, c)) {
				for (s = Te.event.handlers.call(this, c, l), t = 0;
					(r = s[t++]) && !c.isPropagationStopped();)
					for (c.currentTarget = r.elem, n = 0;
						(o = r.handlers[n++]) && !c.isImmediatePropagationStopped();) c.rnamespace && !1 !== o.namespace && !c.rnamespace.test(o.namespace) || (c.handleObj = o, c.data = o.data, (i = ((Te.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, a)) !== undefined && !1 === (c.result = i) && (c.preventDefault(), c.stopPropagation()));
				return d.postDispatch && d.postDispatch.call(this, c), c.result
			}
		},
		handlers: function (e, t) {
			var n, i, r, o, s, a = [],
				c = t.delegateCount,
				l = e.target;
			if (c && l.nodeType && !("click" === e.type && e.button >= 1))
				for (; l !== this; l = l.parentNode || this)
					if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
						for (o = [], s = {}, n = 0; n < c; n++) s[r = (i = t[n]).selector + " "] === undefined && (s[r] = i.needsContext ? Te(r, this).index(l) > -1 : Te.find(r, this, null, [l]).length), s[r] && o.push(i);
						o.length && a.push({
							elem: l,
							handlers: o
						})
					} return l = this, c < t.length && a.push({
				elem: l,
				handlers: t.slice(c)
			}), a
		},
		addProp: function (e, t) {
			Object.defineProperty(Te.Event.prototype, e, {
				enumerable: !0,
				configurable: !0,
				get: Ae(t) ? function () {
					if (this.originalEvent) return t(this.originalEvent)
				} : function () {
					if (this.originalEvent) return this.originalEvent[e]
				},
				set: function (t) {
					Object.defineProperty(this, e, {
						enumerable: !0,
						configurable: !0,
						writable: !0,
						value: t
					})
				}
			})
		},
		fix: function (e) {
			return e[Te.expando] ? e : new Te.Event(e)
		},
		special: {
			load: {
				noBubble: !0
			},
			click: {
				setup: function (e) {
					var t = this || e;
					return tt.test(t.type) && t.click && o(t, "input") && P(t, "click", T), !1
				},
				trigger: function (e) {
					var t = this || e;
					return tt.test(t.type) && t.click && o(t, "input") && P(t, "click"), !0
				},
				_default: function (e) {
					var t = e.target;
					return tt.test(t.type) && t.click && o(t, "input") && Fe.get(t, "click") || o(t, "a")
				}
			},
			beforeunload: {
				postDispatch: function (e) {
					e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
				}
			}
		}
	}, Te.removeEvent = function (e, t, n) {
		e.removeEventListener && e.removeEventListener(t, n)
	}, Te.Event = function (e, t) {
		if (!(this instanceof Te.Event)) return new Te.Event(e, t);
		e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? T : x, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && Te.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[Te.expando] = !0
	}, Te.Event.prototype = {
		constructor: Te.Event,
		isDefaultPrevented: x,
		isPropagationStopped: x,
		isImmediatePropagationStopped: x,
		isSimulated: !1,
		preventDefault: function () {
			var e = this.originalEvent;
			this.isDefaultPrevented = T, e && !this.isSimulated && e.preventDefault()
		},
		stopPropagation: function () {
			var e = this.originalEvent;
			this.isPropagationStopped = T, e && !this.isSimulated && e.stopPropagation()
		},
		stopImmediatePropagation: function () {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = T, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
		}
	}, Te.each({
		altKey: !0,
		bubbles: !0,
		cancelable: !0,
		changedTouches: !0,
		ctrlKey: !0,
		detail: !0,
		eventPhase: !0,
		metaKey: !0,
		pageX: !0,
		pageY: !0,
		shiftKey: !0,
		view: !0,
		char: !0,
		code: !0,
		charCode: !0,
		key: !0,
		keyCode: !0,
		button: !0,
		buttons: !0,
		clientX: !0,
		clientY: !0,
		offsetX: !0,
		offsetY: !0,
		pointerId: !0,
		pointerType: !0,
		screenX: !0,
		screenY: !0,
		targetTouches: !0,
		toElement: !0,
		touches: !0,
		which: function (e) {
			var t = e.button;
			return null == e.which && st.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && t !== undefined && at.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
		}
	}, Te.event.addProp), Te.each({
		focus: "focusin",
		blur: "focusout"
	}, function (e, t) {
		Te.event.special[e] = {
			setup: function () {
				return P(this, e, k), !1
			},
			trigger: function () {
				return P(this, e), !0
			},
			delegateType: t
		}
	}), Te.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (e, t) {
		Te.event.special[e] = {
			delegateType: t,
			bindType: t,
			handle: function (e) {
				var n, i = this,
					r = e.relatedTarget,
					o = e.handleObj;
				return r && (r === i || Te.contains(i, r)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
			}
		}
	}), Te.fn.extend({
		on: function (e, t, n, i) {
			return E(this, e, t, n, i)
		},
		one: function (e, t, n, i) {
			return E(this, e, t, n, i, 1)
		},
		off: function (e, t, n) {
			var i, r;
			if (e && e.preventDefault && e.handleObj) return i = e.handleObj, Te(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
			if ("object" == typeof e) {
				for (r in e) this.off(r, t, e[r]);
				return this
			}
			return !1 !== t && "function" != typeof t || (n = t, t = undefined), !1 === n && (n = x), this.each(function () {
				Te.event.remove(this, e, n, t)
			})
		}
	});
	var lt = /<script|<style|<link/i,
		dt = /checked\s*(?:[^=]|=\s*.checked.)/i,
		ut = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	Te.extend({
		htmlPrefilter: function (e) {
			return e
		},
		clone: function (e, t, n) {
			var i, r, o, s, a = e.cloneNode(!0),
				c = Qe(e);
			if (!(ye.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Te.isXMLDoc(e)))
				for (s = w(a), i = 0, r = (o = w(e)).length; i < r; i++) O(o[i], s[i]);
			if (t)
				if (n)
					for (o = o || w(e), s = s || w(a), i = 0, r = o.length; i < r; i++) I(o[i], s[i]);
				else I(e, a);
			return (s = w(a, "script")).length > 0 && S(s, !c && w(e, "script")), a
		},
		cleanData: function (e) {
			for (var t, n, i, r = Te.event.special, o = 0;
				(n = e[o]) !== undefined; o++)
				if (He(n)) {
					if (t = n[Fe.expando]) {
						if (t.events)
							for (i in t.events) r[i] ? Te.event.remove(n, i) : Te.removeEvent(n, i, t.handle);
						n[Fe.expando] = undefined
					}
					n[Be.expando] && (n[Be.expando] = undefined)
				}
		}
	}), Te.fn.extend({
		detach: function (e) {
			return M(this, e, !0)
		},
		remove: function (e) {
			return M(this, e)
		},
		text: function (e) {
			return je(this, function (e) {
				return e === undefined ? Te.text(this) : this.empty().each(function () {
					1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
				})
			}, null, e, arguments.length)
		},
		append: function () {
			return L(this, arguments, function (e) {
				1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || D(this, e).appendChild(e)
			})
		},
		prepend: function () {
			return L(this, arguments, function (e) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = D(this, e);
					t.insertBefore(e, t.firstChild)
				}
			})
		},
		before: function () {
			return L(this, arguments, function (e) {
				this.parentNode && this.parentNode.insertBefore(e, this)
			})
		},
		after: function () {
			return L(this, arguments, function (e) {
				this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
			})
		},
		empty: function () {
			for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (Te.cleanData(w(e, !1)), e.textContent = "");
			return this
		},
		clone: function (e, t) {
			return e = null != e && e, t = null == t ? e : t, this.map(function () {
				return Te.clone(this, e, t)
			})
		},
		html: function (e) {
			return je(this, function (e) {
				var t = this[0] || {},
					n = 0,
					i = this.length;
				if (e === undefined && 1 === t.nodeType) return t.innerHTML;
				if ("string" == typeof e && !lt.test(e) && !rt[(nt.exec(e) || ["", ""])[1].toLowerCase()]) {
					e = Te.htmlPrefilter(e);
					try {
						for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (Te.cleanData(w(t, !1)), t.innerHTML = e);
						t = 0
					} catch (r) {}
				}
				t && this.empty().append(e)
			}, null, e, arguments.length)
		},
		replaceWith: function () {
			var e = [];
			return L(this, arguments, function (t) {
				var n = this.parentNode;
				Te.inArray(this, e) < 0 && (Te.cleanData(w(this)), n && n.replaceChild(t, this))
			}, e)
		}
	}), Te.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (e, t) {
		Te.fn[e] = function (e) {
			for (var n, i = [], r = Te(e), o = r.length - 1, s = 0; s <= o; s++) n = s === o ? this : this.clone(!0), Te(r[s])[t](n), ue.apply(i, n.get());
			return this.pushStack(i)
		}
	});
	var pt = new RegExp("^(" + We + ")(?!px)[a-z%]+$", "i"),
		ft = function (t) {
			var n = t.ownerDocument.defaultView;
			return n && n.opener || (n = e), n.getComputedStyle(t)
		},
		ht = function (e, t, n) {
			var i, r, o = {};
			for (r in t) o[r] = e.style[r], e.style[r] = t[r];
			for (r in i = n.call(e), t) e.style[r] = o[r];
			return i
		},
		mt = new RegExp(Ve.join("|"), "i");
	! function () {
		function t() {
			if (d) {
				l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", d.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Ge.appendChild(l).appendChild(d);
				var t = e.getComputedStyle(d);
				i = "1%" !== t.top, c = 12 === n(t.marginLeft), d.style.right = "60%", s = 36 === n(t.right), r = 36 === n(t.width), d.style.position = "absolute", o = 12 === n(d.offsetWidth / 3), Ge.removeChild(l), d = null
			}
		}

		function n(e) {
			return Math.round(parseFloat(e))
		}
		var i, r, o, s, a, c, l = we.createElement("div"),
			d = we.createElement("div");
		d.style && (d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", ye.clearCloneStyle = "content-box" === d.style.backgroundClip, Te.extend(ye, {
			boxSizingReliable: function () {
				return t(), r
			},
			pixelBoxStyles: function () {
				return t(), s
			},
			pixelPosition: function () {
				return t(), i
			},
			reliableMarginLeft: function () {
				return t(), c
			},
			scrollboxSize: function () {
				return t(), o
			},
			reliableTrDimensions: function () {
				var t, n, i, r;
				return null == a && (t = we.createElement("table"), n = we.createElement("tr"), i = we.createElement("div"), t.style.cssText = "position:absolute;left:-11111px", n.style.height = "1px", i.style.height = "9px", Ge.appendChild(t).appendChild(n).appendChild(i), r = e.getComputedStyle(n), a = parseInt(r.height) > 3, Ge.removeChild(t)), a
			}
		}))
	}();
	var gt = ["Webkit", "Moz", "ms"],
		vt = we.createElement("div").style,
		yt = {},
		At = /^(none|table(?!-c[ea]).+)/,
		bt = /^--/,
		wt = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		St = {
			letterSpacing: "0",
			fontWeight: "400"
		};
	Te.extend({
		cssHooks: {
			opacity: {
				get: function (e, t) {
					if (t) {
						var n = j(e, "opacity");
						return "" === n ? "1" : n
					}
				}
			}
		},
		cssNumber: {
			animationIterationCount: !0,
			columnCount: !0,
			fillOpacity: !0,
			flexGrow: !0,
			flexShrink: !0,
			fontWeight: !0,
			gridArea: !0,
			gridColumn: !0,
			gridColumnEnd: !0,
			gridColumnStart: !0,
			gridRow: !0,
			gridRowEnd: !0,
			gridRowStart: !0,
			lineHeight: !0,
			opacity: !0,
			order: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {},
		style: function (e, t, n, i) {
			if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
				var r, o, s, a = h(t),
					c = bt.test(t),
					l = e.style;
				if (c || (t = H(a)), s = Te.cssHooks[t] || Te.cssHooks[a], n === undefined) return s && "get" in s && (r = s.get(e, !1, i)) !== undefined ? r : l[t];
				"string" === (o = typeof n) && (r = Ue.exec(n)) && r[1] && (n = y(e, t, r), o = "number"), null != n && n == n && ("number" !== o || c || (n += r && r[3] || (Te.cssNumber[a] ? "" : "px")), ye.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), s && "set" in s && (n = s.set(e, n, i)) === undefined || (c ? l.setProperty(t, n) : l[t] = n))
			}
		},
		css: function (e, t, n, i) {
			var r, o, s, a = h(t);
			return bt.test(t) || (t = H(a)), (s = Te.cssHooks[t] || Te.cssHooks[a]) && "get" in s && (r = s.get(e, !0, n)), r === undefined && (r = j(e, t, i)), "normal" === r && t in St && (r = St[t]), "" === n || n ? (o = parseFloat(r), !0 === n || isFinite(o) ? o || 0 : r) : r
		}
	}), Te.each(["height", "width"], function (e, t) {
		Te.cssHooks[t] = {
			get: function (e, n, i) {
				if (n) return !At.test(Te.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? q(e, t, i) : ht(e, wt, function () {
					return q(e, t, i)
				})
			},
			set: function (e, n, i) {
				var r, o = ft(e),
					s = !ye.scrollboxSize() && "absolute" === o.position,
					a = (s || i) && "border-box" === Te.css(e, "boxSizing", !1, o),
					c = i ? B(e, t, i, a, o) : 0;
				return a && s && (c -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - B(e, t, "border", !1, o) - .5)), c && (r = Ue.exec(n)) && "px" !== (r[3] || "px") && (e.style[t] = n, n = Te.css(e, t)), F(e, n, c)
			}
		}
	}), Te.cssHooks.marginLeft = N(ye.reliableMarginLeft, function (e, t) {
		if (t) return (parseFloat(j(e, "marginLeft")) || e.getBoundingClientRect().left - ht(e, {
			marginLeft: 0
		}, function () {
			return e.getBoundingClientRect().left
		})) + "px"
	}), Te.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (e, t) {
		Te.cssHooks[e + t] = {
			expand: function (n) {
				for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + Ve[i] + t] = o[i] || o[i - 2] || o[0];
				return r
			}
		}, "margin" !== e && (Te.cssHooks[e + t].set = F)
	}), Te.fn.extend({
		css: function (e, t) {
			return je(this, function (e, t, n) {
				var i, r, o = {},
					s = 0;
				if (Array.isArray(t)) {
					for (i = ft(e), r = t.length; s < r; s++) o[t[s]] = Te.css(e, t[s], !1, i);
					return o
				}
				return n !== undefined ? Te.style(e, t, n) : Te.css(e, t)
			}, e, t, arguments.length > 1)
		}
	}), Te.Tween = z, z.prototype = {
		constructor: z,
		init: function (e, t, n, i, r, o) {
			this.elem = e, this.prop = n, this.easing = r || Te.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (Te.cssNumber[n] ? "" : "px")
		},
		cur: function () {
			var e = z.propHooks[this.prop];
			return e && e.get ? e.get(this) : z.propHooks._default.get(this)
		},
		run: function (e) {
			var t, n = z.propHooks[this.prop];
			return this.options.duration ? this.pos = t = Te.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : z.propHooks._default.set(this), this
		}
	}, z.prototype.init.prototype = z.prototype, z.propHooks = {
		_default: {
			get: function (e) {
				var t;
				return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = Te.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
			},
			set: function (e) {
				Te.fx.step[e.prop] ? Te.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !Te.cssHooks[e.prop] && null == e.elem.style[H(e.prop)] ? e.elem[e.prop] = e.now : Te.style(e.elem, e.prop, e.now + e.unit)
			}
		}
	}, z.propHooks.scrollTop = z.propHooks.scrollLeft = {
		set: function (e) {
			e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
		}
	}, Te.easing = {
		linear: function (e) {
			return e
		},
		swing: function (e) {
			return .5 - Math.cos(e * Math.PI) / 2
		},
		_default: "swing"
	}, Te.fx = z.prototype.init, Te.fx.step = {};
	var Ct, Tt, xt = /^(?:toggle|show|hide)$/,
		kt = /queueHooks$/;
	Te.Animation = Te.extend(X, {
			tweeners: {
				"*": [function (e, t) {
					var n = this.createTween(e, t);
					return y(n.elem, e, Ue.exec(t), n), n
				}]
			},
			tweener: function (e, t) {
				Ae(e) ? (t = e, e = ["*"]) : e = e.match(Oe);
				for (var n, i = 0, r = e.length; i < r; i++) n = e[i], X.tweeners[n] = X.tweeners[n] || [], X.tweeners[n].unshift(t)
			},
			prefilters: [Q],
			prefilter: function (e, t) {
				t ? X.prefilters.unshift(e) : X.prefilters.push(e)
			}
		}), Te.speed = function (e, t, n) {
			var i = e && "object" == typeof e ? Te.extend({}, e) : {
				complete: n || !n && t || Ae(e) && e,
				duration: e,
				easing: n && t || t && !Ae(t) && t
			};
			return Te.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in Te.fx.speeds ? i.duration = Te.fx.speeds[i.duration] : i.duration = Te.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function () {
				Ae(i.old) && i.old.call(this), i.queue && Te.dequeue(this, i.queue)
			}, i
		}, Te.fn.extend({
			fadeTo: function (e, t, n, i) {
				return this.filter(Xe).css("opacity", 0).show().end().animate({
					opacity: t
				}, e, n, i)
			},
			animate: function (e, t, n, i) {
				var r = Te.isEmptyObject(e),
					o = Te.speed(t, n, i),
					s = function () {
						var t = X(this, Te.extend({}, e), o);
						(r || Fe.get(this, "finish")) && t.stop(!0)
					};
				return s.finish = s, r || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
			},
			stop: function (e, t, n) {
				var i = function (e) {
					var t = e.stop;
					delete e.stop, t(n)
				};
				return "string" != typeof e && (n = t, t = e, e = undefined), t && this.queue(e || "fx", []), this.each(function () {
					var t = !0,
						r = null != e && e + "queueHooks",
						o = Te.timers,
						s = Fe.get(this);
					if (r) s[r] && s[r].stop && i(s[r]);
					else
						for (r in s) s[r] && s[r].stop && kt.test(r) && i(s[r]);
					for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
					!t && n || Te.dequeue(this, e)
				})
			},
			finish: function (e) {
				return !1 !== e && (e = e || "fx"), this.each(function () {
					var t, n = Fe.get(this),
						i = n[e + "queue"],
						r = n[e + "queueHooks"],
						o = Te.timers,
						s = i ? i.length : 0;
					for (n.finish = !0, Te.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
					for (t = 0; t < s; t++) i[t] && i[t].finish && i[t].finish.call(this);
					delete n.finish
				})
			}
		}), Te.each(["toggle", "show", "hide"], function (e, t) {
			var n = Te.fn[t];
			Te.fn[t] = function (e, i, r) {
				return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(V(t, !0), e, i, r)
			}
		}), Te.each({
			slideDown: V("show"),
			slideUp: V("hide"),
			slideToggle: V("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		}, function (e, t) {
			Te.fn[e] = function (e, n, i) {
				return this.animate(t, e, n, i)
			}
		}), Te.timers = [], Te.fx.tick = function () {
			var e, t = 0,
				n = Te.timers;
			for (Ct = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
			n.length || Te.fx.stop(), Ct = undefined
		}, Te.fx.timer = function (e) {
			Te.timers.push(e), Te.fx.start()
		}, Te.fx.interval = 13, Te.fx.start = function () {
			Tt || (Tt = !0, W())
		}, Te.fx.stop = function () {
			Tt = null
		}, Te.fx.speeds = {
			slow: 600,
			fast: 200,
			_default: 400
		}, Te.fn.delay = function (t, n) {
			return t = Te.fx && Te.fx.speeds[t] || t, n = n || "fx", this.queue(n, function (n, i) {
				var r = e.setTimeout(n, t);
				i.stop = function () {
					e.clearTimeout(r)
				}
			})
		},
		function () {
			var e = we.createElement("input"),
				t = we.createElement("select").appendChild(we.createElement("option"));
			e.type = "checkbox", ye.checkOn = "" !== e.value, ye.optSelected = t.selected, (e = we.createElement("input")).value = "t", e.type = "radio", ye.radioValue = "t" === e.value
		}();
	var _t, Et = Te.expr.attrHandle;
	Te.fn.extend({
		attr: function (e, t) {
			return je(this, Te.attr, e, t, arguments.length > 1)
		},
		removeAttr: function (e) {
			return this.each(function () {
				Te.removeAttr(this, e)
			})
		}
	}), Te.extend({
		attr: function (e, t, n) {
			var i, r, o = e.nodeType;
			if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? Te.prop(e, t, n) : (1 === o && Te.isXMLDoc(e) || (r = Te.attrHooks[t.toLowerCase()] || (Te.expr.match.bool.test(t) ? _t : undefined)), n !== undefined ? null === n ? void Te.removeAttr(e, t) : r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n) : r && "get" in r && null !== (i = r.get(e, t)) ? i : null == (i = Te.find.attr(e, t)) ? undefined : i)
		},
		attrHooks: {
			type: {
				set: function (e, t) {
					if (!ye.radioValue && "radio" === t && o(e, "input")) {
						var n = e.value;
						return e.setAttribute("type", t), n && (e.value = n), t
					}
				}
			}
		},
		removeAttr: function (e, t) {
			var n, i = 0,
				r = t && t.match(Oe);
			if (r && 1 === e.nodeType)
				for (; n = r[i++];) e.removeAttribute(n)
		}
	}), _t = {
		set: function (e, t, n) {
			return !1 === t ? Te.removeAttr(e, n) : e.setAttribute(n, n), n
		}
	}, Te.each(Te.expr.match.bool.source.match(/\w+/g), function (e, t) {
		var n = Et[t] || Te.find.attr;
		Et[t] = function (e, t, i) {
			var r, o, s = t.toLowerCase();
			return i || (o = Et[s], Et[s] = r, r = null != n(e, t, i) ? s : null, Et[s] = o), r
		}
	});
	var Pt = /^(?:input|select|textarea|button)$/i,
		Dt = /^(?:a|area)$/i;
	Te.fn.extend({
		prop: function (e, t) {
			return je(this, Te.prop, e, t, arguments.length > 1)
		},
		removeProp: function (e) {
			return this.each(function () {
				delete this[Te.propFix[e] || e]
			})
		}
	}), Te.extend({
		prop: function (e, t, n) {
			var i, r, o = e.nodeType;
			if (3 !== o && 8 !== o && 2 !== o) return 1 === o && Te.isXMLDoc(e) || (t = Te.propFix[t] || t, r = Te.propHooks[t]), n !== undefined ? r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
		},
		propHooks: {
			tabIndex: {
				get: function (e) {
					var t = Te.find.attr(e, "tabindex");
					return t ? parseInt(t, 10) : Pt.test(e.nodeName) || Dt.test(e.nodeName) && e.href ? 0 : -1
				}
			}
		},
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	}), ye.optSelected || (Te.propHooks.selected = {
		get: function (e) {
			var t = e.parentNode;
			return t && t.parentNode && t.parentNode.selectedIndex, null
		},
		set: function (e) {
			var t = e.parentNode;
			t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
		}
	}), Te.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		Te.propFix[this.toLowerCase()] = this
	}), Te.fn.extend({
		addClass: function (e) {
			var t, n, i, r, o, s, a, c = 0;
			if (Ae(e)) return this.each(function (t) {
				Te(this).addClass(e.call(this, t, Z(this)))
			});
			if ((t = ee(e)).length)
				for (; n = this[c++];)
					if (r = Z(n), i = 1 === n.nodeType && " " + K(r) + " ") {
						for (s = 0; o = t[s++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
						r !== (a = K(i)) && n.setAttribute("class", a)
					} return this
		},
		removeClass: function (e) {
			var t, n, i, r, o, s, a, c = 0;
			if (Ae(e)) return this.each(function (t) {
				Te(this).removeClass(e.call(this, t, Z(this)))
			});
			if (!arguments.length) return this.attr("class", "");
			if ((t = ee(e)).length)
				for (; n = this[c++];)
					if (r = Z(n), i = 1 === n.nodeType && " " + K(r) + " ") {
						for (s = 0; o = t[s++];)
							for (; i.indexOf(" " + o + " ") > -1;) i = i.replace(" " + o + " ", " ");
						r !== (a = K(i)) && n.setAttribute("class", a)
					} return this
		},
		toggleClass: function (e, t) {
			var n = typeof e,
				i = "string" === n || Array.isArray(e);
			return "boolean" == typeof t && i ? t ? this.addClass(e) : this.removeClass(e) : Ae(e) ? this.each(function (n) {
				Te(this).toggleClass(e.call(this, n, Z(this), t), t)
			}) : this.each(function () {
				var t, r, o, s;
				if (i)
					for (r = 0, o = Te(this), s = ee(e); t = s[r++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
				else e !== undefined && "boolean" !== n || ((t = Z(this)) && Fe.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Fe.get(this, "__className__") || ""))
			})
		},
		hasClass: function (e) {
			var t, n, i = 0;
			for (t = " " + e + " "; n = this[i++];)
				if (1 === n.nodeType && (" " + K(Z(n)) + " ").indexOf(t) > -1) return !0;
			return !1
		}
	});
	var $t = /\r/g;
	Te.fn.extend({
		val: function (e) {
			var t, n, i, r = this[0];
			return arguments.length ? (i = Ae(e), this.each(function (n) {
				var r;
				1 === this.nodeType && (null == (r = i ? e.call(this, n, Te(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : Array.isArray(r) && (r = Te.map(r, function (e) {
					return null == e ? "" : e + ""
				})), (t = Te.valHooks[this.type] || Te.valHooks[this.nodeName.toLowerCase()]) && "set" in t && t.set(this, r, "value") !== undefined || (this.value = r))
			})) : r ? (t = Te.valHooks[r.type] || Te.valHooks[r.nodeName.toLowerCase()]) && "get" in t && (n = t.get(r, "value")) !== undefined ? n : "string" == typeof (n = r.value) ? n.replace($t, "") : null == n ? "" : n : void 0
		}
	}), Te.extend({
		valHooks: {
			option: {
				get: function (e) {
					var t = Te.find.attr(e, "value");
					return null != t ? t : K(Te.text(e))
				}
			},
			select: {
				get: function (e) {
					var t, n, i, r = e.options,
						s = e.selectedIndex,
						a = "select-one" === e.type,
						c = a ? null : [],
						l = a ? s + 1 : r.length;
					for (i = s < 0 ? l : a ? s : 0; i < l; i++)
						if (((n = r[i]).selected || i === s) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
							if (t = Te(n).val(), a) return t;
							c.push(t)
						} return c
				},
				set: function (e, t) {
					for (var n, i, r = e.options, o = Te.makeArray(t), s = r.length; s--;)((i = r[s]).selected = Te.inArray(Te.valHooks.option.get(i), o) > -1) && (n = !0);
					return n || (e.selectedIndex = -1), o
				}
			}
		}
	}), Te.each(["radio", "checkbox"], function () {
		Te.valHooks[this] = {
			set: function (e, t) {
				if (Array.isArray(t)) return e.checked = Te.inArray(Te(e).val(), t) > -1
			}
		}, ye.checkOn || (Te.valHooks[this].get = function (e) {
			return null === e.getAttribute("value") ? "on" : e.value
		})
	}), ye.focusin = "onfocusin" in e;
	var Rt = /^(?:focusinfocus|focusoutblur)$/,
		It = function (e) {
			e.stopPropagation()
		};
	Te.extend(Te.event, {
		trigger: function (t, n, i, r) {
			var o, s, a, c, l, d, u, p, f = [i || we],
				h = me.call(t, "type") ? t.type : t,
				m = me.call(t, "namespace") ? t.namespace.split(".") : [];
			if (s = p = a = i = i || we, 3 !== i.nodeType && 8 !== i.nodeType && !Rt.test(h + Te.event.triggered) && (h.indexOf(".") > -1 && (h = (m = h.split(".")).shift(), m.sort()), l = h.indexOf(":") < 0 && "on" + h, (t = t[Te.expando] ? t : new Te.Event(h, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = m.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target || (t.target = i), n = null == n ? [t] : Te.makeArray(n, [t]), u = Te.event.special[h] || {}, r || !u.trigger || !1 !== u.trigger.apply(i, n))) {
				if (!r && !u.noBubble && !be(i)) {
					for (c = u.delegateType || h, Rt.test(c + h) || (s = s.parentNode); s; s = s.parentNode) f.push(s), a = s;
					a === (i.ownerDocument || we) && f.push(a.defaultView || a.parentWindow || e)
				}
				for (o = 0;
					(s = f[o++]) && !t.isPropagationStopped();) p = s, t.type = o > 1 ? c : u.bindType || h, (d = (Fe.get(s, "events") || Object.create(null))[t.type] && Fe.get(s, "handle")) && d.apply(s, n), (d = l && s[l]) && d.apply && He(s) && (t.result = d.apply(s, n), !1 === t.result && t.preventDefault());
				return t.type = h, r || t.isDefaultPrevented() || u._default && !1 !== u._default.apply(f.pop(), n) || !He(i) || l && Ae(i[h]) && !be(i) && ((a = i[l]) && (i[l] = null), Te.event.triggered = h, t.isPropagationStopped() && p.addEventListener(h, It), i[h](), t.isPropagationStopped() && p.removeEventListener(h, It), Te.event.triggered = undefined, a && (i[l] = a)), t.result
			}
		},
		simulate: function (e, t, n) {
			var i = Te.extend(new Te.Event, n, {
				type: e,
				isSimulated: !0
			});
			Te.event.trigger(i, null, t)
		}
	}), Te.fn.extend({
		trigger: function (e, t) {
			return this.each(function () {
				Te.event.trigger(e, t, this)
			})
		},
		triggerHandler: function (e, t) {
			var n = this[0];
			if (n) return Te.event.trigger(e, t, n, !0)
		}
	}), ye.focusin || Te.each({
		focus: "focusin",
		blur: "focusout"
	}, function (e, t) {
		var n = function (e) {
			Te.event.simulate(t, e.target, Te.event.fix(e))
		};
		Te.event.special[t] = {
			setup: function () {
				var i = this.ownerDocument || this.document || this,
					r = Fe.access(i, t);
				r || i.addEventListener(e, n, !0), Fe.access(i, t, (r || 0) + 1)
			},
			teardown: function () {
				var i = this.ownerDocument || this.document || this,
					r = Fe.access(i, t) - 1;
				r ? Fe.access(i, t, r) : (i.removeEventListener(e, n, !0), Fe.remove(i, t))
			}
		}
	});
	var Ot = e.location,
		Lt = {
			guid: Date.now()
		},
		Mt = /\?/;
	Te.parseXML = function (t) {
		var n;
		if (!t || "string" != typeof t) return null;
		try {
			n = (new e.DOMParser).parseFromString(t, "text/xml")
		} catch (i) {
			n = undefined
		}
		return n && !n.getElementsByTagName("parsererror").length || Te.error("Invalid XML: " + t), n
	};
	var jt = /\[\]$/,
		Nt = /\r?\n/g,
		Jt = /^(?:submit|button|image|reset|file)$/i,
		Ht = /^(?:input|select|textarea|keygen)/i;
	Te.param = function (e, t) {
		var n, i = [],
			r = function (e, t) {
				var n = Ae(t) ? t() : t;
				i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
			};
		if (null == e) return "";
		if (Array.isArray(e) || e.jquery && !Te.isPlainObject(e)) Te.each(e, function () {
			r(this.name, this.value)
		});
		else
			for (n in e) te(n, e[n], t, r);
		return i.join("&")
	}, Te.fn.extend({
		serialize: function () {
			return Te.param(this.serializeArray())
		},
		serializeArray: function () {
			return this.map(function () {
				var e = Te.prop(this, "elements");
				return e ? Te.makeArray(e) : this
			}).filter(function () {
				var e = this.type;
				return this.name && !Te(this).is(":disabled") && Ht.test(this.nodeName) && !Jt.test(e) && (this.checked || !tt.test(e))
			}).map(function (e, t) {
				var n = Te(this).val();
				return null == n ? null : Array.isArray(n) ? Te.map(n, function (e) {
					return {
						name: t.name,
						value: e.replace(Nt, "\r\n")
					}
				}) : {
					name: t.name,
					value: n.replace(Nt, "\r\n")
				}
			}).get()
		}
	});
	var Ft = /%20/g,
		Bt = /#.*$/,
		qt = /([?&])_=[^&]*/,
		zt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
		Wt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		Ut = /^(?:GET|HEAD)$/,
		Vt = /^\/\//,
		Gt = {},
		Qt = {},
		Yt = "*/".concat("*"),
		Xt = we.createElement("a");
	Xt.href = Ot.href, Te.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: Ot.href,
			type: "GET",
			isLocal: Wt.test(Ot.protocol),
			global: !0,
			processData: !0,
			async: !0,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": Yt,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": !0,
				"text json": JSON.parse,
				"text xml": Te.parseXML
			},
			flatOptions: {
				url: !0,
				context: !0
			}
		},
		ajaxSetup: function (e, t) {
			return t ? re(re(e, Te.ajaxSettings), t) : re(Te.ajaxSettings, e)
		},
		ajaxPrefilter: ne(Gt),
		ajaxTransport: ne(Qt),
		ajax: function (t, n) {
			function i(t, n, i, a) {
				var l, p, f, b, w, S = n;
				d || (d = !0, c && e.clearTimeout(c), r = undefined, s = a || "", C.readyState = t > 0 ? 4 : 0, l = t >= 200 && t < 300 || 304 === t, i && (b = oe(h, C, i)), !l && Te.inArray("script", h.dataTypes) > -1 && (h.converters["text script"] = function () {}), b = se(h, b, C, l), l ? (h.ifModified && ((w = C.getResponseHeader("Last-Modified")) && (Te.lastModified[o] = w), (w = C.getResponseHeader("etag")) && (Te.etag[o] = w)), 204 === t || "HEAD" === h.type ? S = "nocontent" : 304 === t ? S = "notmodified" : (S = b.state, p = b.data, l = !(f = b.error))) : (f = S, !t && S || (S = "error", t < 0 && (t = 0))), C.status = t, C.statusText = (n || S) + "", l ? v.resolveWith(m, [p, S, C]) : v.rejectWith(m, [C, S, f]), C.statusCode(A), A = undefined, u && g.trigger(l ? "ajaxSuccess" : "ajaxError", [C, h, l ? p : f]), y.fireWith(m, [C, S]), u && (g.trigger("ajaxComplete", [C, h]), --Te.active || Te.event.trigger("ajaxStop")))
			}
			"object" == typeof t && (n = t, t = undefined), n = n || {};
			var r, o, s, a, c, l, d, u, p, f, h = Te.ajaxSetup({}, n),
				m = h.context || h,
				g = h.context && (m.nodeType || m.jquery) ? Te(m) : Te.event,
				v = Te.Deferred(),
				y = Te.Callbacks("once memory"),
				A = h.statusCode || {},
				b = {},
				w = {},
				S = "canceled",
				C = {
					readyState: 0,
					getResponseHeader: function (e) {
						var t;
						if (d) {
							if (!a)
								for (a = {}; t = zt.exec(s);) a[t[1].toLowerCase() + " "] = (a[t[1].toLowerCase() + " "] || []).concat(t[2]);
							t = a[e.toLowerCase() + " "]
						}
						return null == t ? null : t.join(", ")
					},
					getAllResponseHeaders: function () {
						return d ? s : null
					},
					setRequestHeader: function (e, t) {
						return null == d && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e, b[e] = t), this
					},
					overrideMimeType: function (e) {
						return null == d && (h.mimeType = e), this
					},
					statusCode: function (e) {
						var t;
						if (e)
							if (d) C.always(e[C.status]);
							else
								for (t in e) A[t] = [A[t], e[t]];
						return this
					},
					abort: function (e) {
						var t = e || S;
						return r && r.abort(t), i(0, t), this
					}
				};
			if (v.promise(C), h.url = ((t || h.url || Ot.href) + "").replace(Vt, Ot.protocol + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(Oe) || [""], null == h.crossDomain) {
				l = we.createElement("a");
				try {
					l.href = h.url, l.href = l.href, h.crossDomain = Xt.protocol + "//" + Xt.host != l.protocol + "//" + l.host
				} catch (T) {
					h.crossDomain = !0
				}
			}
			if (h.data && h.processData && "string" != typeof h.data && (h.data = Te.param(h.data, h.traditional)), ie(Gt, h, n, C), d) return C;
			for (p in (u = Te.event && h.global) && 0 == Te.active++ && Te.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Ut.test(h.type), o = h.url.replace(Bt, ""), h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Ft, "+")) : (f = h.url.slice(o.length), h.data && (h.processData || "string" == typeof h.data) && (o += (Mt.test(o) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (o = o.replace(qt, "$1"), f = (Mt.test(o) ? "&" : "?") + "_=" + Lt.guid++ + f), h.url = o + f), h.ifModified && (Te.lastModified[o] && C.setRequestHeader("If-Modified-Since", Te.lastModified[o]), Te.etag[o] && C.setRequestHeader("If-None-Match", Te.etag[o])), (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && C.setRequestHeader("Content-Type", h.contentType), C.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Yt + "; q=0.01" : "") : h.accepts["*"]), h.headers) C.setRequestHeader(p, h.headers[p]);
			if (h.beforeSend && (!1 === h.beforeSend.call(m, C, h) || d)) return C.abort();
			if (S = "abort", y.add(h.complete), C.done(h.success), C.fail(h.error), r = ie(Qt, h, n, C)) {
				if (C.readyState = 1, u && g.trigger("ajaxSend", [C, h]), d) return C;
				h.async && h.timeout > 0 && (c = e.setTimeout(function () {
					C.abort("timeout")
				}, h.timeout));
				try {
					d = !1, r.send(b, i)
				} catch (T) {
					if (d) throw T;
					i(-1, T)
				}
			} else i(-1, "No Transport");
			return C
		},
		getJSON: function (e, t, n) {
			return Te.get(e, t, n, "json")
		},
		getScript: function (e, t) {
			return Te.get(e, undefined, t, "script")
		}
	}), Te.each(["get", "post"], function (e, t) {
		Te[t] = function (e, n, i, r) {
			return Ae(n) && (r = r || i, i = n, n = undefined), Te.ajax(Te.extend({
				url: e,
				type: t,
				dataType: r,
				data: n,
				success: i
			}, Te.isPlainObject(e) && e))
		}
	}), Te.ajaxPrefilter(function (e) {
		var t;
		for (t in e.headers) "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
	}), Te._evalUrl = function (e, t, n) {
		return Te.ajax({
			url: e,
			type: "GET",
			dataType: "script",
			cache: !0,
			async: !1,
			global: !1,
			converters: {
				"text script": function () {}
			},
			dataFilter: function (e) {
				Te.globalEval(e, t, n)
			}
		})
	}, Te.fn.extend({
		wrapAll: function (e) {
			var t;
			return this[0] && (Ae(e) && (e = e.call(this[0])), t = Te(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
				for (var e = this; e.firstElementChild;) e = e.firstElementChild;
				return e
			}).append(this)), this
		},
		wrapInner: function (e) {
			return Ae(e) ? this.each(function (t) {
				Te(this).wrapInner(e.call(this, t))
			}) : this.each(function () {
				var t = Te(this),
					n = t.contents();
				n.length ? n.wrapAll(e) : t.append(e)
			})
		},
		wrap: function (e) {
			var t = Ae(e);
			return this.each(function (n) {
				Te(this).wrapAll(t ? e.call(this, n) : e)
			})
		},
		unwrap: function (e) {
			return this.parent(e).not("body").each(function () {
				Te(this).replaceWith(this.childNodes)
			}), this
		}
	}), Te.expr.pseudos.hidden = function (e) {
		return !Te.expr.pseudos.visible(e)
	}, Te.expr.pseudos.visible = function (e) {
		return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
	}, Te.ajaxSettings.xhr = function () {
		try {
			return new e.XMLHttpRequest
		} catch (t) {}
	};
	var Kt = {
			0: 200,
			1223: 204
		},
		Zt = Te.ajaxSettings.xhr();
	ye.cors = !!Zt && "withCredentials" in Zt, ye.ajax = Zt = !!Zt, Te.ajaxTransport(function (t) {
		var n, i;
		if (ye.cors || Zt && !t.crossDomain) return {
			send: function (r, o) {
				var s, a = t.xhr();
				if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
					for (s in t.xhrFields) a[s] = t.xhrFields[s];
				for (s in t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest"), r) a.setRequestHeader(s, r[s]);
				n = function (e) {
					return function () {
						n && (n = i = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null, "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? o(0, "error") : o(a.status, a.statusText) : o(Kt[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
							binary: a.response
						} : {
							text: a.responseText
						}, a.getAllResponseHeaders()))
					}
				}, a.onload = n(), i = a.onerror = a.ontimeout = n("error"), a.onabort !== undefined ? a.onabort = i : a.onreadystatechange = function () {
					4 === a.readyState && e.setTimeout(function () {
						n && i()
					})
				}, n = n("abort");
				try {
					a.send(t.hasContent && t.data || null)
				} catch (c) {
					if (n) throw c
				}
			},
			abort: function () {
				n && n()
			}
		}
	}), Te.ajaxPrefilter(function (e) {
		e.crossDomain && (e.contents.script = !1)
	}), Te.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function (e) {
				return Te.globalEval(e), e
			}
		}
	}), Te.ajaxPrefilter("script", function (e) {
		e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET")
	}), Te.ajaxTransport("script", function (e) {
		var t, n;
		if (e.crossDomain || e.scriptAttrs) return {
			send: function (i, r) {
				t = Te("<script>").attr(e.scriptAttrs || {}).prop({
					charset: e.scriptCharset,
					src: e.url
				}).on("load error", n = function (e) {
					t.remove(), n = null, e && r("error" === e.type ? 404 : 200, e.type)
				}), we.head.appendChild(t[0])
			},
			abort: function () {
				n && n()
			}
		}
	});
	var en, tn = [],
		nn = /(=)\?(?=&|$)|\?\?/;
	Te.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function () {
			var e = tn.pop() || Te.expando + "_" + Lt.guid++;
			return this[e] = !0, e
		}
	}), Te.ajaxPrefilter("json jsonp", function (t, n, i) {
		var r, o, s, a = !1 !== t.jsonp && (nn.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && nn.test(t.data) && "data");
		if (a || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = Ae(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(nn, "$1" + r) : !1 !== t.jsonp && (t.url += (Mt.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
			return s || Te.error(r + " was not called"), s[0]
		}, t.dataTypes[0] = "json", o = e[r], e[r] = function () {
			s = arguments
		}, i.always(function () {
			o === undefined ? Te(e).removeProp(r) : e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, tn.push(r)), s && Ae(o) && o(s[0]), s = o = undefined
		}), "script"
	}), ye.createHTMLDocument = ((en = we.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === en.childNodes.length), Te.parseHTML = function (e, t, n) {
		return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (ye.createHTMLDocument ? ((i = (t = we.implementation.createHTMLDocument("")).createElement("base")).href = we.location.href, t.head.appendChild(i)) : t = we), o = !n && [], (r = Pe.exec(e)) ? [t.createElement(r[1])] : (r = C([e], t, o), o && o.length && Te(o).remove(), Te.merge([], r.childNodes)));
		var i, r, o
	}, Te.fn.load = function (e, t, n) {
		var i, r, o, s = this,
			a = e.indexOf(" ");
		return a > -1 && (i = K(e.slice(a)), e = e.slice(0, a)), Ae(t) ? (n = t, t = undefined) : t && "object" == typeof t && (r = "POST"), s.length > 0 && Te.ajax({
			url: e,
			type: r || "GET",
			dataType: "html",
			data: t
		}).done(function (e) {
			o = arguments, s.html(i ? Te("<div>").append(Te.parseHTML(e)).find(i) : e)
		}).always(n && function (e, t) {
			s.each(function () {
				n.apply(this, o || [e.responseText, t, e])
			})
		}), this
	}, Te.expr.pseudos.animated = function (e) {
		return Te.grep(Te.timers, function (t) {
			return e === t.elem
		}).length
	}, Te.offset = {
		setOffset: function (e, t, n) {
			var i, r, o, s, a, c, l = Te.css(e, "position"),
				d = Te(e),
				u = {};
			"static" === l && (e.style.position = "relative"), a = d.offset(), o = Te.css(e, "top"), c = Te.css(e, "left"), ("absolute" === l || "fixed" === l) && (o + c).indexOf("auto") > -1 ? (s = (i = d.position()).top, r = i.left) : (s = parseFloat(o) || 0, r = parseFloat(c) || 0), Ae(t) && (t = t.call(e, n, Te.extend({}, a))), null != t.top && (u.top = t.top - a.top + s), null != t.left && (u.left = t.left - a.left + r), "using" in t ? t.using.call(e, u) : ("number" == typeof u.top && (u.top += "px"), "number" == typeof u.left && (u.left += "px"), d.css(u))
		}
	}, Te.fn.extend({
		offset: function (e) {
			if (arguments.length) return e === undefined ? this : this.each(function (t) {
				Te.offset.setOffset(this, e, t)
			});
			var t, n, i = this[0];
			return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
				top: t.top + n.pageYOffset,
				left: t.left + n.pageXOffset
			}) : {
				top: 0,
				left: 0
			} : void 0
		},
		position: function () {
			if (this[0]) {
				var e, t, n, i = this[0],
					r = {
						top: 0,
						left: 0
					};
				if ("fixed" === Te.css(i, "position")) t = i.getBoundingClientRect();
				else {
					for (t = this.offset(), n = i.ownerDocument, e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === Te.css(e, "position");) e = e.parentNode;
					e && e !== i && 1 === e.nodeType && ((r = Te(e).offset()).top += Te.css(e, "borderTopWidth", !0), r.left += Te.css(e, "borderLeftWidth", !0))
				}
				return {
					top: t.top - r.top - Te.css(i, "marginTop", !0),
					left: t.left - r.left - Te.css(i, "marginLeft", !0)
				}
			}
		},
		offsetParent: function () {
			return this.map(function () {
				for (var e = this.offsetParent; e && "static" === Te.css(e, "position");) e = e.offsetParent;
				return e || Ge
			})
		}
	}), Te.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function (e, t) {
		var n = "pageYOffset" === t;
		Te.fn[e] = function (i) {
			return je(this, function (e, i, r) {
				var o;
				if (be(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), r === undefined) return o ? o[t] : e[i];
				o ? o.scrollTo(n ? o.pageXOffset : r, n ? r : o.pageYOffset) : e[i] = r
			}, e, i, arguments.length)
		}
	}), Te.each(["top", "left"], function (e, t) {
		Te.cssHooks[t] = N(ye.pixelPosition, function (e, n) {
			if (n) return n = j(e, t), pt.test(n) ? Te(e).position()[t] + "px" : n
		})
	}), Te.each({
		Height: "height",
		Width: "width"
	}, function (e, t) {
		Te.each({
			padding: "inner" + e,
			content: t,
			"": "outer" + e
		}, function (n, i) {
			Te.fn[i] = function (r, o) {
				var s = arguments.length && (n || "boolean" != typeof r),
					a = n || (!0 === r || !0 === o ? "margin" : "border");
				return je(this, function (t, n, r) {
					var o;
					return be(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : r === undefined ? Te.css(t, n, a) : Te.style(t, n, r, a)
				}, t, s ? r : undefined, s)
			}
		})
	}), Te.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
		Te.fn[t] = function (e) {
			return this.on(t, e)
		}
	}), Te.fn.extend({
		bind: function (e, t, n) {
			return this.on(e, null, t, n)
		},
		unbind: function (e, t) {
			return this.off(e, null, t)
		},
		delegate: function (e, t, n, i) {
			return this.on(t, e, n, i)
		},
		undelegate: function (e, t, n) {
			return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
		},
		hover: function (e, t) {
			return this.mouseenter(e).mouseleave(t || e)
		}
	}), Te.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, t) {
		Te.fn[t] = function (e, n) {
			return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
		}
	});
	var rn = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	Te.proxy = function (e, t) {
		var n, i, r;
		return "string" == typeof t && (n = e[t], t = e, e = n), Ae(e) ? (i = le.call(arguments, 2), (r = function () {
			return e.apply(t || this, i.concat(le.call(arguments)))
		}).guid = e.guid = e.guid || Te.guid++, r) : undefined
	}, Te.holdReady = function (e) {
		e ? Te.readyWait++ : Te.ready(!0)
	}, Te.isArray = Array.isArray, Te.parseJSON = JSON.parse, Te.nodeName = o, Te.isFunction = Ae, Te.isWindow = be, Te.camelCase = h, Te.type = i, Te.now = Date.now, Te.isNumeric = function (e) {
		var t = Te.type(e);
		return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
	}, Te.trim = function (e) {
		return null == e ? "" : (e + "").replace(rn, "")
	}, "function" == typeof define && define.amd && define("jquery", [], function () {
		return Te
	});
	var on = e.jQuery,
		sn = e.$;
	return Te.noConflict = function (t) {
		return e.$ === Te && (e.$ = sn), t && e.jQuery === Te && (e.jQuery = on), Te
	}, void 0 === t && (e.jQuery = e.$ = Te), Te
}),
function (e, t) {
	"use strict";
	var n;
	e.rails !== t && e.error("jquery-ujs has already been loaded!");
	var i = e(document);
	e.rails = n = {
		linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
		buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
		inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
		formSubmitSelector: "form",
		formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
		disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
		enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
		requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
		fileInputSelector: "input[name][type=file]:not([disabled])",
		linkDisableSelector: "a[data-disable-with], a[data-disable]",
		buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
		csrfToken: function () {
			return e("meta[name=csrf-token]").attr("content")
		},
		csrfParam: function () {
			return e("meta[name=csrf-param]").attr("content")
		},
		CSRFProtection: function (e) {
			var t = n.csrfToken();
			t && e.setRequestHeader("X-CSRF-Token", t)
		},
		refreshCSRFTokens: function () {
			e('form input[name="' + n.csrfParam() + '"]').val(n.csrfToken())
		},
		fire: function (t, n, i) {
			var r = e.Event(n);
			return t.trigger(r, i), !1 !== r.result
		},
		confirm: function (e) {
			return confirm(e)
		},
		ajax: function (t) {
			return e.ajax(t)
		},
		href: function (e) {
			return e[0].href
		},
		isRemote: function (e) {
			return e.data("remote") !== t && !1 !== e.data("remote")
		},
		handleRemote: function (i) {
			var r, o, s, a, c, l;
			if (n.fire(i, "ajax:before")) {
				if (a = i.data("with-credentials") || null, c = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
					r = i.data("ujs:submit-button-formmethod") || i.attr("method"), o = i.data("ujs:submit-button-formaction") || i.attr("action"), s = e(i[0]).serializeArray();
					var d = i.data("ujs:submit-button");
					d && (s.push(d), i.data("ujs:submit-button", null)), i.data("ujs:submit-button-formmethod", null), i.data("ujs:submit-button-formaction", null)
				} else i.is(n.inputChangeSelector) ? (r = i.data("method"), o = i.data("url"), s = i.serialize(), i.data("params") && (s = s + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (r = i.data("method") || "get", o = i.data("url"), s = i.serialize(), i.data("params") && (s = s + "&" + i.data("params"))) : (r = i.data("method"), o = n.href(i), s = i.data("params") || null);
				return l = {
					type: r || "GET",
					data: s,
					dataType: c,
					beforeSend: function (e, r) {
						if (r.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + r.accepts.script), !n.fire(i, "ajax:beforeSend", [e, r])) return !1;
						i.trigger("ajax:send", e)
					},
					success: function (e, t, n) {
						i.trigger("ajax:success", [e, t, n])
					},
					complete: function (e, t) {
						i.trigger("ajax:complete", [e, t])
					},
					error: function (e, t, n) {
						i.trigger("ajax:error", [e, t, n])
					},
					crossDomain: n.isCrossDomain(o)
				}, a && (l.xhrFields = {
					withCredentials: a
				}), o && (l.url = o), n.ajax(l)
			}
			return !1
		},
		isCrossDomain: function (e) {
			var t = document.createElement("a");
			t.href = location.href;
			var n = document.createElement("a");
			try {
				return n.href = e, n.href = n.href, !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host)
			} catch (i) {
				return !0
			}
		},
		handleMethod: function (i) {
			var r = n.href(i),
				o = i.data("method"),
				s = i.attr("target"),
				a = n.csrfToken(),
				c = n.csrfParam(),
				l = e('<form method="post" action="' + r + '"></form>'),
				d = '<input name="_method" value="' + o + '" type="hidden" />';
			c === t || a === t || n.isCrossDomain(r) || (d += '<input name="' + c + '" value="' + a + '" type="hidden" />'), s && l.attr("target", s), l.hide().append(d).appendTo("body"), l.submit()
		},
		formElements: function (t, n) {
			return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
		},
		disableFormElements: function (t) {
			n.formElements(t, n.disableSelector).each(function () {
				n.disableFormElement(e(this))
			})
		},
		disableFormElement: function (e) {
			var n, i;
			n = e.is("button") ? "html" : "val", (i = e.data("disable-with")) !== t && (e.data("ujs:enable-with", e[n]()), e[n](i)), e.prop("disabled", !0), e.data("ujs:disabled", !0)
		},
		enableFormElements: function (t) {
			n.formElements(t, n.enableSelector).each(function () {
				n.enableFormElement(e(this))
			})
		},
		enableFormElement: function (e) {
			var n = e.is("button") ? "html" : "val";
			e.data("ujs:enable-with") !== t && (e[n](e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.prop("disabled", !1), e.removeData("ujs:disabled")
		},
		allowAction: function (e) {
			var t, i = e.data("confirm"),
				r = !1;
			if (!i) return !0;
			if (n.fire(e, "confirm")) {
				try {
					r = n.confirm(i)
				} catch (o) {
					(console.error || console.log).call(console, o.stack || o)
				}
				t = n.fire(e, "confirm:complete", [r])
			}
			return r && t
		},
		blankInputs: function (t, n, i) {
			var r, o, s, a = e(),
				c = n || "input,textarea",
				l = t.find(c),
				d = {};
			return l.each(function () {
				(r = e(this)).is("input[type=radio]") ? (s = r.attr("name"), d[s] || (0 === t.find('input[type=radio]:checked[name="' + s + '"]').length && (o = t.find('input[type=radio][name="' + s + '"]'), a = a.add(o)), d[s] = s)) : (r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : !!r.val()) === i && (a = a.add(r))
			}), !!a.length && a
		},
		nonBlankInputs: function (e, t) {
			return n.blankInputs(e, t, !0)
		},
		stopEverything: function (t) {
			return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
		},
		disableElement: function (e) {
			var i = e.data("disable-with");
			i !== t && (e.data("ujs:enable-with", e.html()), e.html(i)), e.bind("click.railsDisable", function (e) {
				return n.stopEverything(e)
			}), e.data("ujs:disabled", !0)
		},
		enableElement: function (e) {
			e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable"), e.removeData("ujs:disabled")
		}
	}, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function (e, t, i) {
		e.crossDomain || n.CSRFProtection(i)
	}), e(window).on("pageshow.rails", function () {
		e(e.rails.enableSelector).each(function () {
			var t = e(this);
			t.data("ujs:disabled") && e.rails.enableFormElement(t)
		}), e(e.rails.linkDisableSelector).each(function () {
			var t = e(this);
			t.data("ujs:disabled") && e.rails.enableElement(t)
		})
	}), i.on("ajax:complete", n.linkDisableSelector, function () {
		n.enableElement(e(this))
	}), i.on("ajax:complete", n.buttonDisableSelector, function () {
		n.enableFormElement(e(this))
	}), i.on("click.rails", n.linkClickSelector, function (t) {
		var i = e(this),
			r = i.data("method"),
			o = i.data("params"),
			s = t.metaKey || t.ctrlKey;
		if (!n.allowAction(i)) return n.stopEverything(t);
		if (!s && i.is(n.linkDisableSelector) && n.disableElement(i), n.isRemote(i)) {
			if (s && (!r || "GET" === r) && !o) return !0;
			var a = n.handleRemote(i);
			return !1 === a ? n.enableElement(i) : a.fail(function () {
				n.enableElement(i)
			}), !1
		}
		return r ? (n.handleMethod(i), !1) : void 0
	}), i.on("click.rails", n.buttonClickSelector, function (t) {
		var i = e(this);
		if (!n.allowAction(i) || !n.isRemote(i)) return n.stopEverything(t);
		i.is(n.buttonDisableSelector) && n.disableFormElement(i);
		var r = n.handleRemote(i);
		return !1 === r ? n.enableFormElement(i) : r.fail(function () {
			n.enableFormElement(i)
		}), !1
	}), i.on("change.rails", n.inputChangeSelector, function (t) {
		var i = e(this);
		return n.allowAction(i) && n.isRemote(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
	}), i.on("submit.rails", n.formSubmitSelector, function (i) {
		var r, o, s = e(this),
			a = n.isRemote(s);
		if (!n.allowAction(s)) return n.stopEverything(i);
		if (s.attr("novalidate") === t)
			if (s.data("ujs:formnovalidate-button") === t) {
				if ((r = n.blankInputs(s, n.requiredInputSelector, !1)) && n.fire(s, "ajax:aborted:required", [r])) return n.stopEverything(i)
			} else s.data("ujs:formnovalidate-button", t);
		if (a) {
			if (o = n.nonBlankInputs(s, n.fileInputSelector)) {
				setTimeout(function () {
					n.disableFormElements(s)
				}, 13);
				var c = n.fire(s, "ajax:aborted:file", [o]);
				return c || setTimeout(function () {
					n.enableFormElements(s)
				}, 13), c
			}
			return n.handleRemote(s), !1
		}
		setTimeout(function () {
			n.disableFormElements(s)
		}, 13)
	}), i.on("click.rails", n.formInputClickSelector, function (t) {
		var i = e(this);
		if (!n.allowAction(i)) return n.stopEverything(t);
		var r = i.attr("name"),
			o = r ? {
				name: r,
				value: i.val()
			} : null,
			s = i.closest("form");
		0 === s.length && (s = e("#" + i.attr("form"))), s.data("ujs:submit-button", o), s.data("ujs:formnovalidate-button", i.attr("formnovalidate")), s.data("ujs:submit-button-formaction", i.attr("formaction")), s.data("ujs:submit-button-formmethod", i.attr("formmethod"))
	}), i.on("ajax:send.rails", n.formSubmitSelector, function (t) {
		this === t.target && n.disableFormElements(e(this))
	}), i.on("ajax:complete.rails", n.formSubmitSelector, function (t) {
		this === t.target && n.enableFormElements(e(this))
	}), e(function () {
		n.refreshCSRFTokens()
	}))
}(jQuery),
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */
function () {
	var e = this;
	(function () {
		(function () {
			this.Turbolinks = {
				supported: null != window.history.pushState && null != window.requestAnimationFrame && null != window.addEventListener,
				visit: function (e, n) {
					return t.controller.visit(e, n)
				},
				clearCache: function () {
					return t.controller.clearCache()
				},
				setProgressBarDelay: function (e) {
					return t.controller.setProgressBarDelay(e)
				}
			}
		}).call(this)
	}).call(e);
	var t = e.Turbolinks;
	(function () {
		(function () {
			var e, n, i, r = [].slice;
			t.copyObject = function (e) {
				var t, n, i;
				for (t in n = {}, e) i = e[t], n[t] = i;
				return n
			}, t.closest = function (t, n) {
				return e.call(t, n)
			}, e = function () {
				var e;
				return null != (e = document.documentElement.closest) ? e : function (e) {
					var t;
					for (t = this; t;) {
						if (t.nodeType === Node.ELEMENT_NODE && n.call(t, e)) return t;
						t = t.parentNode
					}
				}
			}(), t.defer = function (e) {
				return setTimeout(e, 1)
			}, t.throttle = function (e) {
				var t;
				return t = null,
					function () {
						var n, i;
						return n = 1 <= arguments.length ? r.call(arguments, 0) : [], null != t ? t : t = requestAnimationFrame((i = this, function () {
							return t = null, e.apply(i, n)
						}))
					}
			}, t.dispatch = function (e, t) {
				var n, r, o, s, a, c;
				return c = (a = null != t ? t : {}).target, n = a.cancelable, r = a.data, (o = document.createEvent("Events")).initEvent(e, !0, !0 === n), o.data = null != r ? r : {}, o.cancelable && !i && (s = o.preventDefault, o.preventDefault = function () {
					return this.defaultPrevented || Object.defineProperty(this, "defaultPrevented", {
						get: function () {
							return !0
						}
					}), s.call(this)
				}), (null != c ? c : document).dispatchEvent(o), o
			}, i = function () {
				var e;
				return (e = document.createEvent("Events")).initEvent("test", !0, !0), e.preventDefault(), e.defaultPrevented
			}(), t.match = function (e, t) {
				return n.call(e, t)
			}, n = function () {
				var e, t, n, i;
				return null != (t = null != (n = null != (i = (e = document.documentElement).matchesSelector) ? i : e.webkitMatchesSelector) ? n : e.msMatchesSelector) ? t : e.mozMatchesSelector
			}(), t.uuid = function () {
				var e, t, n;
				for (n = "", e = t = 1; 36 >= t; e = ++t) n += 9 === e || 14 === e || 19 === e || 24 === e ? "-" : 15 === e ? "4" : 20 === e ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(15 * Math.random()).toString(16);
				return n
			}
		}).call(this),
			function () {
				t.Location = function () {
					function e(e) {
						var t, n;
						null == e && (e = ""), (n = document.createElement("a")).href = e.toString(), this.absoluteURL = n.href, 2 > (t = n.hash.length) ? this.requestURL = this.absoluteURL : (this.requestURL = this.absoluteURL.slice(0, -t), this.anchor = n.hash.slice(1))
					}
					var t, n, i, r;
					return e.wrap = function (e) {
						return e instanceof this ? e : new this(e)
					}, e.prototype.getOrigin = function () {
						return this.absoluteURL.split("/", 3).join("/")
					}, e.prototype.getPath = function () {
						var e, t;
						return null != (e = null != (t = this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/)) ? t[1] : void 0) ? e : "/"
					}, e.prototype.getPathComponents = function () {
						return this.getPath().split("/").slice(1)
					}, e.prototype.getLastPathComponent = function () {
						return this.getPathComponents().slice(-1)[0]
					}, e.prototype.getExtension = function () {
						var e, t;
						return null != (e = null != (t = this.getLastPathComponent().match(/\.[^.]*$/)) ? t[0] : void 0) ? e : ""
					}, e.prototype.isHTML = function () {
						return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)
					}, e.prototype.isPrefixedBy = function (e) {
						var t;
						return t = n(e), this.isEqualTo(e) || r(this.absoluteURL, t)
					}, e.prototype.isEqualTo = function (e) {
						return this.absoluteURL === (null != e ? e.absoluteURL : void 0)
					}, e.prototype.toCacheKey = function () {
						return this.requestURL
					}, e.prototype.toJSON = function () {
						return this.absoluteURL
					}, e.prototype.toString = function () {
						return this.absoluteURL
					}, e.prototype.valueOf = function () {
						return this.absoluteURL
					}, n = function (e) {
						return t(e.getOrigin() + e.getPath())
					}, t = function (e) {
						return i(e, "/") ? e : e + "/"
					}, r = function (e, t) {
						return e.slice(0, t.length) === t
					}, i = function (e, t) {
						return e.slice(-t.length) === t
					}, e
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.HttpRequest = function () {
					function n(n, i, r) {
						this.delegate = n, this.requestCanceled = e(this.requestCanceled, this), this.requestTimedOut = e(this.requestTimedOut, this), this.requestFailed = e(this.requestFailed, this), this.requestLoaded = e(this.requestLoaded, this), this.requestProgressed = e(this.requestProgressed, this), this.url = t.Location.wrap(i).requestURL, this.referrer = t.Location.wrap(r).absoluteURL, this.createXHR()
					}
					return n.NETWORK_FAILURE = 0, n.TIMEOUT_FAILURE = -1, n.timeout = 60, n.prototype.send = function () {
						var e;
						return this.xhr && !this.sent ? (this.notifyApplicationBeforeRequestStart(), this.setProgress(0), this.xhr.send(), this.sent = !0, "function" == typeof (e = this.delegate).requestStarted ? e.requestStarted() : void 0) : void 0
					}, n.prototype.cancel = function () {
						return this.xhr && this.sent ? this.xhr.abort() : void 0
					}, n.prototype.requestProgressed = function (e) {
						return e.lengthComputable ? this.setProgress(e.loaded / e.total) : void 0
					}, n.prototype.requestLoaded = function () {
						return this.endRequest((e = this, function () {
							var t;
							return 200 <= (t = e.xhr.status) && 300 > t ? e.delegate.requestCompletedWithResponse(e.xhr.responseText, e.xhr.getResponseHeader("Turbolinks-Location")) : (e.failed = !0, e.delegate.requestFailedWithStatusCode(e.xhr.status, e.xhr.responseText))
						}));
						var e
					}, n.prototype.requestFailed = function () {
						return this.endRequest((e = this, function () {
							return e.failed = !0, e.delegate.requestFailedWithStatusCode(e.constructor.NETWORK_FAILURE)
						}));
						var e
					}, n.prototype.requestTimedOut = function () {
						return this.endRequest((e = this, function () {
							return e.failed = !0, e.delegate.requestFailedWithStatusCode(e.constructor.TIMEOUT_FAILURE)
						}));
						var e
					}, n.prototype.requestCanceled = function () {
						return this.endRequest()
					}, n.prototype.notifyApplicationBeforeRequestStart = function () {
						return t.dispatch("turbolinks:request-start", {
							data: {
								url: this.url,
								xhr: this.xhr
							}
						})
					}, n.prototype.notifyApplicationAfterRequestEnd = function () {
						return t.dispatch("turbolinks:request-end", {
							data: {
								url: this.url,
								xhr: this.xhr
							}
						})
					}, n.prototype.createXHR = function () {
						return this.xhr = new XMLHttpRequest, this.xhr.open("GET", this.url, !0), this.xhr.timeout = 1e3 * this.constructor.timeout, this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml"), this.xhr.setRequestHeader("Turbolinks-Referrer", this.referrer), this.xhr.onprogress = this.requestProgressed, this.xhr.onload = this.requestLoaded, this.xhr.onerror = this.requestFailed, this.xhr.ontimeout = this.requestTimedOut, this.xhr.onabort = this.requestCanceled
					}, n.prototype.endRequest = function (e) {
						return this.xhr ? (this.notifyApplicationAfterRequestEnd(), null != e && e.call(this), this.destroy()) : void 0
					}, n.prototype.setProgress = function (e) {
						var t;
						return this.progress = e, "function" == typeof (t = this.delegate).requestProgressed ? t.requestProgressed(this.progress) : void 0
					}, n.prototype.destroy = function () {
						var e;
						return this.setProgress(1), "function" == typeof (e = this.delegate).requestFinished && e.requestFinished(), this.delegate = null, this.xhr = null
					}, n
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.ProgressBar = function () {
					function t() {
						this.trickle = e(this.trickle, this), this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement()
					}
					var n;
					return n = 300, t.defaultCSS = ".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width " + n + "ms ease-out, opacity " + n / 2 + "ms " + n / 2 + "ms ease-in;\n  transform: translate3d(0, 0, 0);\n}", t.prototype.show = function () {
						return this.visible ? void 0 : (this.visible = !0, this.installStylesheetElement(), this.installProgressElement(), this.startTrickling())
					}, t.prototype.hide = function () {
						return this.visible && !this.hiding ? (this.hiding = !0, this.fadeProgressElement((e = this, function () {
							return e.uninstallProgressElement(), e.stopTrickling(), e.visible = !1, e.hiding = !1
						}))) : void 0;
						var e
					}, t.prototype.setValue = function (e) {
						return this.value = e, this.refresh()
					}, t.prototype.installStylesheetElement = function () {
						return document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
					}, t.prototype.installProgressElement = function () {
						return this.progressElement.style.width = 0, this.progressElement.style.opacity = 1, document.documentElement.insertBefore(this.progressElement, document.body), this.refresh()
					}, t.prototype.fadeProgressElement = function (e) {
						return this.progressElement.style.opacity = 0, setTimeout(e, 1.5 * n)
					}, t.prototype.uninstallProgressElement = function () {
						return this.progressElement.parentNode ? document.documentElement.removeChild(this.progressElement) : void 0
					}, t.prototype.startTrickling = function () {
						return null != this.trickleInterval ? this.trickleInterval : this.trickleInterval = setInterval(this.trickle, n)
					}, t.prototype.stopTrickling = function () {
						return clearInterval(this.trickleInterval), this.trickleInterval = null
					}, t.prototype.trickle = function () {
						return this.setValue(this.value + Math.random() / 100)
					}, t.prototype.refresh = function () {
						return requestAnimationFrame((e = this, function () {
							return e.progressElement.style.width = 10 + 90 * e.value + "%"
						}));
						var e
					}, t.prototype.createStylesheetElement = function () {
						var e;
						return (e = document.createElement("style")).type = "text/css", e.textContent = this.constructor.defaultCSS, e
					}, t.prototype.createProgressElement = function () {
						var e;
						return (e = document.createElement("div")).className = "turbolinks-progress-bar", e
					}, t
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.BrowserAdapter = function () {
					function n(n) {
						this.controller = n, this.showProgressBar = e(this.showProgressBar, this), this.progressBar = new t.ProgressBar
					}
					var i, r, o;
					return o = t.HttpRequest, i = o.NETWORK_FAILURE, r = o.TIMEOUT_FAILURE, n.prototype.visitProposedToLocationWithAction = function (e, t) {
						return this.controller.startVisitToLocationWithAction(e, t)
					}, n.prototype.visitStarted = function (e) {
						return e.issueRequest(), e.changeHistory(), e.loadCachedSnapshot()
					}, n.prototype.visitRequestStarted = function (e) {
						return this.progressBar.setValue(0), e.hasCachedSnapshot() || "restore" !== e.action ? this.showProgressBarAfterDelay() : this.showProgressBar()
					}, n.prototype.visitRequestProgressed = function (e) {
						return this.progressBar.setValue(e.progress)
					}, n.prototype.visitRequestCompleted = function (e) {
						return e.loadResponse()
					}, n.prototype.visitRequestFailedWithStatusCode = function (e, t) {
						switch (t) {
							case i:
							case r:
								return this.reload();
							default:
								return e.loadResponse()
						}
					}, n.prototype.visitRequestFinished = function () {
						return this.hideProgressBar()
					}, n.prototype.visitCompleted = function (e) {
						return e.followRedirect()
					}, n.prototype.pageInvalidated = function () {
						return this.reload()
					}, n.prototype.showProgressBarAfterDelay = function () {
						return this.progressBarTimeout = setTimeout(this.showProgressBar, this.controller.progressBarDelay)
					}, n.prototype.showProgressBar = function () {
						return this.progressBar.show()
					}, n.prototype.hideProgressBar = function () {
						return this.progressBar.hide(), clearTimeout(this.progressBarTimeout)
					}, n.prototype.reload = function () {
						return window.location.reload()
					}, n
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.History = function () {
					function n(t) {
						this.delegate = t, this.onPageLoad = e(this.onPageLoad, this), this.onPopState = e(this.onPopState, this)
					}
					return n.prototype.start = function () {
						return this.started ? void 0 : (addEventListener("popstate", this.onPopState, !1), addEventListener("load", this.onPageLoad, !1), this.started = !0)
					}, n.prototype.stop = function () {
						return this.started ? (removeEventListener("popstate", this.onPopState, !1), removeEventListener("load", this.onPageLoad, !1), this.started = !1) : void 0
					}, n.prototype.push = function (e, n) {
						return e = t.Location.wrap(e), this.update("push", e, n)
					}, n.prototype.replace = function (e, n) {
						return e = t.Location.wrap(e), this.update("replace", e, n)
					}, n.prototype.onPopState = function (e) {
						var n, i, r, o;
						return this.shouldHandlePopState() && (o = null != (i = e.state) ? i.turbolinks : void 0) ? (n = t.Location.wrap(window.location), r = o.restorationIdentifier, this.delegate.historyPoppedToLocationWithRestorationIdentifier(n, r)) : void 0
					}, n.prototype.onPageLoad = function () {
						return t.defer(function (e) {
							return function () {
								return e.pageLoaded = !0
							}
						}(this))
					}, n.prototype.shouldHandlePopState = function () {
						return this.pageIsLoaded()
					}, n.prototype.pageIsLoaded = function () {
						return this.pageLoaded || "complete" === document.readyState
					}, n.prototype.update = function (e, t, n) {
						var i;
						return i = {
							turbolinks: {
								restorationIdentifier: n
							}
						}, history[e + "State"](i, null, t)
					}, n
				}()
			}.call(this),
			function () {
				t.HeadDetails = function () {
					function e(e) {
						var t, n, i, s, a;
						for (this.elements = {}, n = 0, s = e.length; s > n; n++)(a = e[n]).nodeType === Node.ELEMENT_NODE && (i = a.outerHTML, (null != (t = this.elements)[i] ? t[i] : t[i] = {
							type: o(a),
							tracked: r(a),
							elements: []
						}).elements.push(a))
					}
					var t, n, i, r, o;
					return e.fromHeadElement = function (e) {
						var t;
						return new this(null != (t = null != e ? e.childNodes : void 0) ? t : [])
					}, e.prototype.hasElementWithKey = function (e) {
						return e in this.elements
					}, e.prototype.getTrackedElementSignature = function () {
						var e;
						return function () {
							var t, n;
							for (e in n = [], t = this.elements) t[e].tracked && n.push(e);
							return n
						}.call(this).join("")
					}, e.prototype.getScriptElementsNotInDetails = function (e) {
						return this.getElementsMatchingTypeNotInDetails("script", e)
					}, e.prototype.getStylesheetElementsNotInDetails = function (e) {
						return this.getElementsMatchingTypeNotInDetails("stylesheet", e)
					}, e.prototype.getElementsMatchingTypeNotInDetails = function (e, t) {
						var n, i, r, o, s, a;
						for (i in s = [], r = this.elements) a = (o = r[i]).type, n = o.elements, a !== e || t.hasElementWithKey(i) || s.push(n[0]);
						return s
					}, e.prototype.getProvisionalElements = function () {
						var e, t, n, i, r, o, s;
						for (t in n = [], i = this.elements) s = (r = i[t]).type, o = r.tracked, e = r.elements, null != s || o ? e.length > 1 && n.push.apply(n, e.slice(1)) : n.push.apply(n, e);
						return n
					}, e.prototype.getMetaValue = function (e) {
						var t;
						return null != (t = this.findMetaElementByName(e)) ? t.getAttribute("content") : void 0
					}, e.prototype.findMetaElementByName = function (e) {
						var n, i, r, o;
						for (r in n = void 0, o = this.elements) i = o[r].elements, t(i[0], e) && (n = i[0]);
						return n
					}, o = function (e) {
						return n(e) ? "script" : i(e) ? "stylesheet" : void 0
					}, r = function (e) {
						return "reload" === e.getAttribute("data-turbolinks-track")
					}, n = function (e) {
						return "script" === e.tagName.toLowerCase()
					}, i = function (e) {
						var t;
						return "style" === (t = e.tagName.toLowerCase()) || "link" === t && "stylesheet" === e.getAttribute("rel")
					}, t = function (e, t) {
						return "meta" === e.tagName.toLowerCase() && e.getAttribute("name") === t
					}, e
				}()
			}.call(this),
			function () {
				t.Snapshot = function () {
					function e(e, t) {
						this.headDetails = e, this.bodyElement = t
					}
					return e.wrap = function (e) {
						return e instanceof this ? e : "string" == typeof e ? this.fromHTMLString(e) : this.fromHTMLElement(e)
					}, e.fromHTMLString = function (e) {
						var t;
						return (t = document.createElement("html")).innerHTML = e, this.fromHTMLElement(t)
					}, e.fromHTMLElement = function (e) {
						var n, i, r;
						return i = e.querySelector("head"), n = null != (r = e.querySelector("body")) ? r : document.createElement("body"), new this(t.HeadDetails.fromHeadElement(i), n)
					}, e.prototype.clone = function () {
						return new this.constructor(this.headDetails, this.bodyElement.cloneNode(!0))
					}, e.prototype.getRootLocation = function () {
						var e, n;
						return n = null != (e = this.getSetting("root")) ? e : "/", new t.Location(n)
					}, e.prototype.getCacheControlValue = function () {
						return this.getSetting("cache-control")
					}, e.prototype.getElementForAnchor = function (e) {
						try {
							return this.bodyElement.querySelector("[id='" + e + "'], a[name='" + e + "']")
						} catch (t) {}
					}, e.prototype.getPermanentElements = function () {
						return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")
					}, e.prototype.getPermanentElementById = function (e) {
						return this.bodyElement.querySelector("#" + e + "[data-turbolinks-permanent]")
					}, e.prototype.getPermanentElementsPresentInSnapshot = function (e) {
						var t, n, i, r, o;
						for (o = [], n = 0, i = (r = this.getPermanentElements()).length; i > n; n++) t = r[n], e.getPermanentElementById(t.id) && o.push(t);
						return o
					}, e.prototype.findFirstAutofocusableElement = function () {
						return this.bodyElement.querySelector("[autofocus]")
					}, e.prototype.hasAnchor = function (e) {
						return null != this.getElementForAnchor(e)
					}, e.prototype.isPreviewable = function () {
						return "no-preview" !== this.getCacheControlValue()
					}, e.prototype.isCacheable = function () {
						return "no-cache" !== this.getCacheControlValue()
					}, e.prototype.isVisitable = function () {
						return "reload" !== this.getSetting("visit-control")
					}, e.prototype.getSetting = function (e) {
						return this.headDetails.getMetaValue("turbolinks-" + e)
					}, e
				}()
			}.call(this),
			function () {
				var e = [].slice;
				t.Renderer = function () {
					function t() {}
					var n;
					return t.render = function () {
						var t, n, i;
						return n = arguments[0], t = arguments[1], (i = function (e, t, n) {
							n.prototype = e.prototype;
							var i = new n,
								r = e.apply(i, t);
							return Object(r) === r ? r : i
						}(this, 3 <= arguments.length ? e.call(arguments, 2) : [], function () {})).delegate = n, i.render(t), i
					}, t.prototype.renderView = function (e) {
						return this.delegate.viewWillRender(this.newBody), e(), this.delegate.viewRendered(this.newBody)
					}, t.prototype.invalidateView = function () {
						return this.delegate.viewInvalidated()
					}, t.prototype.createScriptElement = function (e) {
						var t;
						return "false" === e.getAttribute("data-turbolinks-eval") ? e : ((t = document.createElement("script")).textContent = e.textContent, t.async = !1, n(t, e), t)
					}, n = function (e, t) {
						var n, i, r, o, s, a, c;
						for (a = [], n = 0, i = (o = t.attributes).length; i > n; n++) r = (s = o[n]).name, c = s.value, a.push(e.setAttribute(r, c));
						return a
					}, t
				}()
			}.call(this),
			function () {
				var e, n, i = function (e, t) {
						function n() {
							this.constructor = e
						}
						for (var i in t) r.call(t, i) && (e[i] = t[i]);
						return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
					},
					r = {}.hasOwnProperty;
				t.SnapshotRenderer = function (t) {
					function r(e, t, n) {
						this.currentSnapshot = e, this.newSnapshot = t, this.isPreview = n, this.currentHeadDetails = this.currentSnapshot.headDetails, this.newHeadDetails = this.newSnapshot.headDetails, this.currentBody = this.currentSnapshot.bodyElement, this.newBody = this.newSnapshot.bodyElement
					}
					return i(r, t), r.prototype.render = function (e) {
						return this.shouldRender() ? (this.mergeHead(), this.renderView((t = this, function () {
							return t.replaceBody(), t.isPreview || t.focusFirstAutofocusableElement(), e()
						}))) : this.invalidateView();
						var t
					}, r.prototype.mergeHead = function () {
						return this.copyNewHeadStylesheetElements(), this.copyNewHeadScriptElements(), this.removeCurrentHeadProvisionalElements(), this.copyNewHeadProvisionalElements()
					}, r.prototype.replaceBody = function () {
						var e;
						return e = this.relocateCurrentBodyPermanentElements(), this.activateNewBodyScriptElements(), this.assignNewBody(), this.replacePlaceholderElementsWithClonedPermanentElements(e)
					}, r.prototype.shouldRender = function () {
						return this.newSnapshot.isVisitable() && this.trackedElementsAreIdentical()
					}, r.prototype.trackedElementsAreIdentical = function () {
						return this.currentHeadDetails.getTrackedElementSignature() === this.newHeadDetails.getTrackedElementSignature()
					}, r.prototype.copyNewHeadStylesheetElements = function () {
						var e, t, n, i, r;
						for (r = [], t = 0, n = (i = this.getNewHeadStylesheetElements()).length; n > t; t++) e = i[t], r.push(document.head.appendChild(e));
						return r
					}, r.prototype.copyNewHeadScriptElements = function () {
						var e, t, n, i, r;
						for (r = [], t = 0, n = (i = this.getNewHeadScriptElements()).length; n > t; t++) e = i[t], r.push(document.head.appendChild(this.createScriptElement(e)));
						return r
					}, r.prototype.removeCurrentHeadProvisionalElements = function () {
						var e, t, n, i, r;
						for (r = [], t = 0, n = (i = this.getCurrentHeadProvisionalElements()).length; n > t; t++) e = i[t], r.push(document.head.removeChild(e));
						return r
					}, r.prototype.copyNewHeadProvisionalElements = function () {
						var e, t, n, i, r;
						for (r = [], t = 0, n = (i = this.getNewHeadProvisionalElements()).length; n > t; t++) e = i[t], r.push(document.head.appendChild(e));
						return r
					}, r.prototype.relocateCurrentBodyPermanentElements = function () {
						var t, i, r, o, s, a, c;
						for (c = [], t = 0, i = (a = this.getCurrentBodyPermanentElements()).length; i > t; t++) o = a[t], s = e(o), r = this.newSnapshot.getPermanentElementById(o.id), n(o, s.element), n(r, o), c.push(s);
						return c
					}, r.prototype.replacePlaceholderElementsWithClonedPermanentElements = function (e) {
						var t, i, r, o, s, a;
						for (a = [], r = 0, o = e.length; o > r; r++) i = (s = e[r]).element, t = s.permanentElement.cloneNode(!0), a.push(n(i, t));
						return a
					}, r.prototype.activateNewBodyScriptElements = function () {
						var e, t, i, r, o, s;
						for (s = [], t = 0, r = (o = this.getNewBodyScriptElements()).length; r > t; t++) i = o[t], e = this.createScriptElement(i), s.push(n(i, e));
						return s
					}, r.prototype.assignNewBody = function () {
						return document.body = this.newBody
					}, r.prototype.focusFirstAutofocusableElement = function () {
						var e;
						return null != (e = this.newSnapshot.findFirstAutofocusableElement()) ? e.focus() : void 0
					}, r.prototype.getNewHeadStylesheetElements = function () {
						return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)
					}, r.prototype.getNewHeadScriptElements = function () {
						return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)
					}, r.prototype.getCurrentHeadProvisionalElements = function () {
						return this.currentHeadDetails.getProvisionalElements()
					}, r.prototype.getNewHeadProvisionalElements = function () {
						return this.newHeadDetails.getProvisionalElements()
					}, r.prototype.getCurrentBodyPermanentElements = function () {
						return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)
					}, r.prototype.getNewBodyScriptElements = function () {
						return this.newBody.querySelectorAll("script")
					}, r
				}(t.Renderer), e = function (e) {
					var t;
					return (t = document.createElement("meta")).setAttribute("name", "turbolinks-permanent-placeholder"), t.setAttribute("content", e.id), {
						element: t,
						permanentElement: e
					}
				}, n = function (e, t) {
					var n;
					return (n = e.parentNode) ? n.replaceChild(t, e) : void 0
				}
			}.call(this),
			function () {
				var e = function (e, t) {
						function i() {
							this.constructor = e
						}
						for (var r in t) n.call(t, r) && (e[r] = t[r]);
						return i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype, e
					},
					n = {}.hasOwnProperty;
				t.ErrorRenderer = function (t) {
					function n(e) {
						var t;
						(t = document.createElement("html")).innerHTML = e, this.newHead = t.querySelector("head"), this.newBody = t.querySelector("body")
					}
					return e(n, t), n.prototype.render = function (e) {
						return this.renderView((t = this, function () {
							return t.replaceHeadAndBody(), t.activateBodyScriptElements(), e()
						}));
						var t
					}, n.prototype.replaceHeadAndBody = function () {
						var e, t;
						return t = document.head, e = document.body, t.parentNode.replaceChild(this.newHead, t), e.parentNode.replaceChild(this.newBody, e)
					}, n.prototype.activateBodyScriptElements = function () {
						var e, t, n, i, r, o;
						for (o = [], t = 0, n = (i = this.getScriptElements()).length; n > t; t++) r = i[t], e = this.createScriptElement(r), o.push(r.parentNode.replaceChild(e, r));
						return o
					}, n.prototype.getScriptElements = function () {
						return document.documentElement.querySelectorAll("script")
					}, n
				}(t.Renderer)
			}.call(this),
			function () {
				t.View = function () {
					function e(e) {
						this.delegate = e, this.htmlElement = document.documentElement
					}
					return e.prototype.getRootLocation = function () {
						return this.getSnapshot().getRootLocation()
					}, e.prototype.getElementForAnchor = function (e) {
						return this.getSnapshot().getElementForAnchor(e)
					}, e.prototype.getSnapshot = function () {
						return t.Snapshot.fromHTMLElement(this.htmlElement)
					}, e.prototype.render = function (e, t) {
						var n, i, r;
						return r = e.snapshot, n = e.error, i = e.isPreview, this.markAsPreview(i), null != r ? this.renderSnapshot(r, i, t) : this.renderError(n, t)
					}, e.prototype.markAsPreview = function (e) {
						return e ? this.htmlElement.setAttribute("data-turbolinks-preview", "") : this.htmlElement.removeAttribute("data-turbolinks-preview")
					}, e.prototype.renderSnapshot = function (e, n, i) {
						return t.SnapshotRenderer.render(this.delegate, i, this.getSnapshot(), t.Snapshot.wrap(e), n)
					}, e.prototype.renderError = function (e, n) {
						return t.ErrorRenderer.render(this.delegate, n, e)
					}, e
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.ScrollManager = function () {
					function n(n) {
						this.delegate = n, this.onScroll = e(this.onScroll, this), this.onScroll = t.throttle(this.onScroll)
					}
					return n.prototype.start = function () {
						return this.started ? void 0 : (addEventListener("scroll", this.onScroll, !1), this.onScroll(), this.started = !0)
					}, n.prototype.stop = function () {
						return this.started ? (removeEventListener("scroll", this.onScroll, !1), this.started = !1) : void 0
					}, n.prototype.scrollToElement = function (e) {
						return e.scrollIntoView()
					}, n.prototype.scrollToPosition = function (e) {
						var t, n;
						return t = e.x, n = e.y, window.scrollTo(t, n)
					}, n.prototype.onScroll = function () {
						return this.updatePosition({
							x: window.pageXOffset,
							y: window.pageYOffset
						})
					}, n.prototype.updatePosition = function (e) {
						var t;
						return this.position = e, null != (t = this.delegate) ? t.scrollPositionChanged(this.position) : void 0
					}, n
				}()
			}.call(this),
			function () {
				t.SnapshotCache = function () {
					function e(e) {
						this.size = e, this.keys = [], this.snapshots = {}
					}
					var n;
					return e.prototype.has = function (e) {
						return n(e) in this.snapshots
					}, e.prototype.get = function (e) {
						var t;
						if (this.has(e)) return t = this.read(e), this.touch(e), t
					}, e.prototype.put = function (e, t) {
						return this.write(e, t), this.touch(e), t
					}, e.prototype.read = function (e) {
						var t;
						return t = n(e), this.snapshots[t]
					}, e.prototype.write = function (e, t) {
						var i;
						return i = n(e), this.snapshots[i] = t
					}, e.prototype.touch = function (e) {
						var t, i;
						return i = n(e), (t = this.keys.indexOf(i)) > -1 && this.keys.splice(t, 1), this.keys.unshift(i), this.trim()
					}, e.prototype.trim = function () {
						var e, t, n, i, r;
						for (r = [], e = 0, n = (i = this.keys.splice(this.size)).length; n > e; e++) t = i[e], r.push(delete this.snapshots[t]);
						return r
					}, n = function (e) {
						return t.Location.wrap(e).toCacheKey()
					}, e
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.Visit = function () {
					function n(n, i, r) {
						this.controller = n, this.action = r, this.performScroll = e(this.performScroll, this), this.identifier = t.uuid(), this.location = t.Location.wrap(i), this.adapter = this.controller.adapter, this.state = "initialized", this.timingMetrics = {}
					}
					var i;
					return n.prototype.start = function () {
						return "initialized" === this.state ? (this.recordTimingMetric("visitStart"), this.state = "started", this.adapter.visitStarted(this)) : void 0
					}, n.prototype.cancel = function () {
						var e;
						return "started" === this.state ? (null != (e = this.request) && e.cancel(), this.cancelRender(), this.state = "canceled") : void 0
					}, n.prototype.complete = function () {
						var e;
						return "started" === this.state ? (this.recordTimingMetric("visitEnd"), this.state = "completed", "function" == typeof (e = this.adapter).visitCompleted && e.visitCompleted(this), this.controller.visitCompleted(this)) : void 0
					}, n.prototype.fail = function () {
						var e;
						return "started" === this.state ? (this.state = "failed", "function" == typeof (e = this.adapter).visitFailed ? e.visitFailed(this) : void 0) : void 0
					}, n.prototype.changeHistory = function () {
						var e, t;
						return this.historyChanged ? void 0 : (e = this.location.isEqualTo(this.referrer) ? "replace" : this.action, t = i(e), this.controller[t](this.location, this.restorationIdentifier), this.historyChanged = !0)
					}, n.prototype.issueRequest = function () {
						return this.shouldIssueRequest() && null == this.request ? (this.progress = 0, this.request = new t.HttpRequest(this, this.location, this.referrer), this.request.send()) : void 0
					}, n.prototype.getCachedSnapshot = function () {
						var e;
						return !(e = this.controller.getCachedSnapshotForLocation(this.location)) || null != this.location.anchor && !e.hasAnchor(this.location.anchor) || "restore" !== this.action && !e.isPreviewable() ? void 0 : e
					}, n.prototype.hasCachedSnapshot = function () {
						return null != this.getCachedSnapshot()
					}, n.prototype.loadCachedSnapshot = function () {
						var e, t;
						return (t = this.getCachedSnapshot()) ? (e = this.shouldIssueRequest(), this.render(function () {
							var n;
							return this.cacheSnapshot(), this.controller.render({
								snapshot: t,
								isPreview: e
							}, this.performScroll), "function" == typeof (n = this.adapter).visitRendered && n.visitRendered(this), e ? void 0 : this.complete()
						})) : void 0
					}, n.prototype.loadResponse = function () {
						return null != this.response ? this.render(function () {
							var e, t;
							return this.cacheSnapshot(), this.request.failed ? (this.controller.render({
								error: this.response
							}, this.performScroll), "function" == typeof (e = this.adapter).visitRendered && e.visitRendered(this), this.fail()) : (this.controller.render({
								snapshot: this.response
							}, this.performScroll), "function" == typeof (t = this.adapter).visitRendered && t.visitRendered(this), this.complete())
						}) : void 0
					}, n.prototype.followRedirect = function () {
						return this.redirectedToLocation && !this.followedRedirect ? (this.location = this.redirectedToLocation, this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier), this.followedRedirect = !0) : void 0
					}, n.prototype.requestStarted = function () {
						var e;
						return this.recordTimingMetric("requestStart"), "function" == typeof (e = this.adapter).visitRequestStarted ? e.visitRequestStarted(this) : void 0
					}, n.prototype.requestProgressed = function (e) {
						var t;
						return this.progress = e, "function" == typeof (t = this.adapter).visitRequestProgressed ? t.visitRequestProgressed(this) : void 0
					}, n.prototype.requestCompletedWithResponse = function (e, n) {
						return this.response = e, null != n && (this.redirectedToLocation = t.Location.wrap(n)), this.adapter.visitRequestCompleted(this)
					}, n.prototype.requestFailedWithStatusCode = function (e, t) {
						return this.response = t, this.adapter.visitRequestFailedWithStatusCode(this, e)
					}, n.prototype.requestFinished = function () {
						var e;
						return this.recordTimingMetric("requestEnd"), "function" == typeof (e = this.adapter).visitRequestFinished ? e.visitRequestFinished(this) : void 0
					}, n.prototype.performScroll = function () {
						return this.scrolled ? void 0 : ("restore" === this.action ? this.scrollToRestoredPosition() || this.scrollToTop() : this.scrollToAnchor() || this.scrollToTop(), this.scrolled = !0)
					}, n.prototype.scrollToRestoredPosition = function () {
						var e, t;
						return null != (e = null != (t = this.restorationData) ? t.scrollPosition : void 0) ? (this.controller.scrollToPosition(e), !0) : void 0
					}, n.prototype.scrollToAnchor = function () {
						return null != this.location.anchor ? (this.controller.scrollToAnchor(this.location.anchor), !0) : void 0
					}, n.prototype.scrollToTop = function () {
						return this.controller.scrollToPosition({
							x: 0,
							y: 0
						})
					}, n.prototype.recordTimingMetric = function (e) {
						var t;
						return null != (t = this.timingMetrics)[e] ? t[e] : t[e] = (new Date).getTime()
					}, n.prototype.getTimingMetrics = function () {
						return t.copyObject(this.timingMetrics)
					}, i = function (e) {
						switch (e) {
							case "replace":
								return "replaceHistoryWithLocationAndRestorationIdentifier";
							case "advance":
							case "restore":
								return "pushHistoryWithLocationAndRestorationIdentifier"
						}
					}, n.prototype.shouldIssueRequest = function () {
						return "restore" !== this.action || !this.hasCachedSnapshot()
					}, n.prototype.cacheSnapshot = function () {
						return this.snapshotCached ? void 0 : (this.controller.cacheSnapshot(), this.snapshotCached = !0)
					}, n.prototype.render = function (e) {
						return this.cancelRender(), this.frame = requestAnimationFrame((t = this, function () {
							return t.frame = null, e.call(t)
						}));
						var t
					}, n.prototype.cancelRender = function () {
						return this.frame ? cancelAnimationFrame(this.frame) : void 0
					}, n
				}()
			}.call(this),
			function () {
				var e = function (e, t) {
					return function () {
						return e.apply(t, arguments)
					}
				};
				t.Controller = function () {
					function n() {
						this.clickBubbled = e(this.clickBubbled, this), this.clickCaptured = e(this.clickCaptured, this), this.pageLoaded = e(this.pageLoaded, this), this.history = new t.History(this), this.view = new t.View(this), this.scrollManager = new t.ScrollManager(this), this.restorationData = {}, this.clearCache(), this.setProgressBarDelay(500)
					}
					return n.prototype.start = function () {
						return t.supported && !this.started ? (addEventListener("click", this.clickCaptured, !0), addEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.start(), this.startHistory(), this.started = !0, this.enabled = !0) : void 0
					}, n.prototype.disable = function () {
						return this.enabled = !1
					}, n.prototype.stop = function () {
						return this.started ? (removeEventListener("click", this.clickCaptured, !0), removeEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.stop(), this.stopHistory(), this.started = !1) : void 0
					}, n.prototype.clearCache = function () {
						return this.cache = new t.SnapshotCache(10)
					}, n.prototype.visit = function (e, n) {
						var i, r;
						return null == n && (n = {}), e = t.Location.wrap(e), this.applicationAllowsVisitingLocation(e) ? this.locationIsVisitable(e) ? (i = null != (r = n.action) ? r : "advance", this.adapter.visitProposedToLocationWithAction(e, i)) : window.location = e : void 0
					}, n.prototype.startVisitToLocationWithAction = function (e, n, i) {
						var r;
						return t.supported ? (r = this.getRestorationDataForIdentifier(i), this.startVisit(e, n, {
							restorationData: r
						})) : window.location = e
					}, n.prototype.setProgressBarDelay = function (e) {
						return this.progressBarDelay = e
					}, n.prototype.startHistory = function () {
						return this.location = t.Location.wrap(window.location), this.restorationIdentifier = t.uuid(), this.history.start(), this.history.replace(this.location, this.restorationIdentifier)
					}, n.prototype.stopHistory = function () {
						return this.history.stop()
					}, n.prototype.pushHistoryWithLocationAndRestorationIdentifier = function (e, n) {
						return this.restorationIdentifier = n, this.location = t.Location.wrap(e), this.history.push(this.location, this.restorationIdentifier)
					}, n.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function (e, n) {
						return this.restorationIdentifier = n, this.location = t.Location.wrap(e), this.history.replace(this.location, this.restorationIdentifier)
					}, n.prototype.historyPoppedToLocationWithRestorationIdentifier = function (e, n) {
						var i;
						return this.restorationIdentifier = n, this.enabled ? (i = this.getRestorationDataForIdentifier(this.restorationIdentifier), this.startVisit(e, "restore", {
							restorationIdentifier: this.restorationIdentifier,
							restorationData: i,
							historyChanged: !0
						}), this.location = t.Location.wrap(e)) : this.adapter.pageInvalidated()
					}, n.prototype.getCachedSnapshotForLocation = function (e) {
						var t;
						return null != (t = this.cache.get(e)) ? t.clone() : void 0
					}, n.prototype.shouldCacheSnapshot = function () {
						return this.view.getSnapshot().isCacheable()
					}, n.prototype.cacheSnapshot = function () {
						var e, n;
						return this.shouldCacheSnapshot() ? (this.notifyApplicationBeforeCachingSnapshot(), n = this.view.getSnapshot(), e = this.lastRenderedLocation, t.defer(function (t) {
							return function () {
								return t.cache.put(e, n.clone())
							}
						}(this))) : void 0
					}, n.prototype.scrollToAnchor = function (e) {
						var t;
						return (t = this.view.getElementForAnchor(e)) ? this.scrollToElement(t) : this.scrollToPosition({
							x: 0,
							y: 0
						})
					}, n.prototype.scrollToElement = function (e) {
						return this.scrollManager.scrollToElement(e)
					}, n.prototype.scrollToPosition = function (e) {
						return this.scrollManager.scrollToPosition(e)
					}, n.prototype.scrollPositionChanged = function (e) {
						return this.getCurrentRestorationData().scrollPosition = e
					}, n.prototype.render = function (e, t) {
						return this.view.render(e, t)
					}, n.prototype.viewInvalidated = function () {
						return this.adapter.pageInvalidated()
					}, n.prototype.viewWillRender = function (e) {
						return this.notifyApplicationBeforeRender(e)
					}, n.prototype.viewRendered = function () {
						return this.lastRenderedLocation = this.currentVisit.location, this.notifyApplicationAfterRender()
					}, n.prototype.pageLoaded = function () {
						return this.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad()
					}, n.prototype.clickCaptured = function () {
						return removeEventListener("click", this.clickBubbled, !1), addEventListener("click", this.clickBubbled, !1)
					}, n.prototype.clickBubbled = function (e) {
						var t, n, i;
						return this.enabled && this.clickEventIsSignificant(e) && (n = this.getVisitableLinkForNode(e.target)) && (i = this.getVisitableLocationForLink(n)) && this.applicationAllowsFollowingLinkToLocation(n, i) ? (e.preventDefault(), t = this.getActionForLink(n), this.visit(i, {
							action: t
						})) : void 0
					}, n.prototype.applicationAllowsFollowingLinkToLocation = function (e, t) {
						return !this.notifyApplicationAfterClickingLinkToLocation(e, t).defaultPrevented
					}, n.prototype.applicationAllowsVisitingLocation = function (e) {
						return !this.notifyApplicationBeforeVisitingLocation(e).defaultPrevented
					}, n.prototype.notifyApplicationAfterClickingLinkToLocation = function (e, n) {
						return t.dispatch("turbolinks:click", {
							target: e,
							data: {
								url: n.absoluteURL
							},
							cancelable: !0
						})
					}, n.prototype.notifyApplicationBeforeVisitingLocation = function (e) {
						return t.dispatch("turbolinks:before-visit", {
							data: {
								url: e.absoluteURL
							},
							cancelable: !0
						})
					}, n.prototype.notifyApplicationAfterVisitingLocation = function (e) {
						return t.dispatch("turbolinks:visit", {
							data: {
								url: e.absoluteURL
							}
						})
					}, n.prototype.notifyApplicationBeforeCachingSnapshot = function () {
						return t.dispatch("turbolinks:before-cache")
					}, n.prototype.notifyApplicationBeforeRender = function (e) {
						return t.dispatch("turbolinks:before-render", {
							data: {
								newBody: e
							}
						})
					}, n.prototype.notifyApplicationAfterRender = function () {
						return t.dispatch("turbolinks:render")
					}, n.prototype.notifyApplicationAfterPageLoad = function (e) {
						return null == e && (e = {}), t.dispatch("turbolinks:load", {
							data: {
								url: this.location.absoluteURL,
								timing: e
							}
						})
					}, n.prototype.startVisit = function (e, t, n) {
						var i;
						return null != (i = this.currentVisit) && i.cancel(), this.currentVisit = this.createVisit(e, t, n), this.currentVisit.start(), this.notifyApplicationAfterVisitingLocation(e)
					}, n.prototype.createVisit = function (e, n, i) {
						var r, o, s, a, c;
						return a = (o = null != i ? i : {}).restorationIdentifier, s = o.restorationData, r = o.historyChanged, (c = new t.Visit(this, e, n)).restorationIdentifier = null != a ? a : t.uuid(), c.restorationData = t.copyObject(s), c.historyChanged = r, c.referrer = this.location, c
					}, n.prototype.visitCompleted = function (e) {
						return this.notifyApplicationAfterPageLoad(e.getTimingMetrics())
					}, n.prototype.clickEventIsSignificant = function (e) {
						return !(e.defaultPrevented || e.target.isContentEditable || e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
					}, n.prototype.getVisitableLinkForNode = function (e) {
						return this.nodeIsVisitable(e) ? t.closest(e, "a[href]:not([target]):not([download])") : void 0
					}, n.prototype.getVisitableLocationForLink = function (e) {
						var n;
						return n = new t.Location(e.getAttribute("href")), this.locationIsVisitable(n) ? n : void 0
					}, n.prototype.getActionForLink = function (e) {
						var t;
						return null != (t = e.getAttribute("data-turbolinks-action")) ? t : "advance"
					}, n.prototype.nodeIsVisitable = function (e) {
						var n;
						return !(n = t.closest(e, "[data-turbolinks]")) || "false" !== n.getAttribute("data-turbolinks")
					}, n.prototype.locationIsVisitable = function (e) {
						return e.isPrefixedBy(this.view.getRootLocation()) && e.isHTML()
					}, n.prototype.getCurrentRestorationData = function () {
						return this.getRestorationDataForIdentifier(this.restorationIdentifier)
					}, n.prototype.getRestorationDataForIdentifier = function (e) {
						var t;
						return null != (t = this.restorationData)[e] ? t[e] : t[e] = {}
					}, n
				}()
			}.call(this),
			function () {
				! function () {
					var e, t;
					if ((e = t = document.currentScript) && !t.hasAttribute("data-turbolinks-suppress-warning"))
						for (; e = e.parentNode;)
							if (e === document.body) return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s", t.outerHTML)
				}()
			}.call(this),
			function () {
				var e, n, i;
				t.start = function () {
					return n() ? (null == t.controller && (t.controller = e()), t.controller.start()) : void 0
				}, n = function () {
					return null == window.Turbolinks && (window.Turbolinks = t), i()
				}, e = function () {
					var e;
					return (e = new t.Controller).adapter = new t.BrowserAdapter(e), e
				}, (i = function () {
					return window.Turbolinks === t
				})() && t.start()
			}.call(this)
	}).call(this), "object" == typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd && define(t)
}.call(this),
	function (e, t) {
		"object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.ActionCable = {})
	}(this, function (e) {
		"use strict";

		function t(e) {
			if ("function" == typeof e && (e = e()), e && !/^wss?:/i.test(e)) {
				var t = document.createElement("a");
				return t.href = e, t.href = t.href, t.protocol = t.protocol.replace("http", "ws"), t.href
			}
			return e
		}

		function n() {
			var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : i("url") || f.default_mount_path;
			return new S(e)
		}

		function i(e) {
			var t = document.head.querySelector("meta[name='action-cable-" + e + "']");
			if (t) return t.getAttribute("content")
		}
		var r = {
				logger: self.console,
				WebSocket: self.WebSocket
			},
			o = {
				log: function () {
					if (this.enabled) {
						for (var e, t = arguments.length, n = Array(t), i = 0; i < t; i++) n[i] = arguments[i];
						n.push(Date.now()), (e = r.logger).log.apply(e, ["[ActionCable]"].concat(n))
					}
				}
			},
			s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			a = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			c = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var i = t[n];
						i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
					}
				}
				return function (t, n, i) {
					return n && e(t.prototype, n), i && e(t, i), t
				}
			}(),
			l = function () {
				return (new Date).getTime()
			},
			d = function (e) {
				return (l() - e) / 1e3
			},
			u = function (e, t, n) {
				return Math.max(t, Math.min(n, e))
			},
			p = function () {
				function e(t) {
					a(this, e), this.visibilityDidChange = this.visibilityDidChange.bind(this), this.connection = t, this.reconnectAttempts = 0
				}
				return e.prototype.start = function () {
					this.isRunning() || (this.startedAt = l(), delete this.stoppedAt, this.startPolling(), addEventListener("visibilitychange", this.visibilityDidChange), o.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms"))
				}, e.prototype.stop = function () {
					this.isRunning() && (this.stoppedAt = l(), this.stopPolling(), removeEventListener("visibilitychange", this.visibilityDidChange), o.log("ConnectionMonitor stopped"))
				}, e.prototype.isRunning = function () {
					return this.startedAt && !this.stoppedAt
				}, e.prototype.recordPing = function () {
					this.pingedAt = l()
				}, e.prototype.recordConnect = function () {
					this.reconnectAttempts = 0, this.recordPing(), delete this.disconnectedAt, o.log("ConnectionMonitor recorded connect")
				}, e.prototype.recordDisconnect = function () {
					this.disconnectedAt = l(), o.log("ConnectionMonitor recorded disconnect")
				}, e.prototype.startPolling = function () {
					this.stopPolling(), this.poll()
				}, e.prototype.stopPolling = function () {
					clearTimeout(this.pollTimeout)
				}, e.prototype.poll = function () {
					var e = this;
					this.pollTimeout = setTimeout(function () {
						e.reconnectIfStale(), e.poll()
					}, this.getPollInterval())
				}, e.prototype.getPollInterval = function () {
					var e = this.constructor.pollInterval,
						t = e.min,
						n = e.max,
						i = e.multiplier * Math.log(this.reconnectAttempts + 1);
					return Math.round(1e3 * u(i, t, n))
				}, e.prototype.reconnectIfStale = function () {
					this.connectionIsStale() && (o.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + d(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s"), this.reconnectAttempts++, this.disconnectedRecently() ? o.log("ConnectionMonitor skipping reopening recent disconnect") : (o.log("ConnectionMonitor reopening"), this.connection.reopen()))
				}, e.prototype.connectionIsStale = function () {
					return d(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold
				}, e.prototype.disconnectedRecently = function () {
					return this.disconnectedAt && d(this.disconnectedAt) < this.constructor.staleThreshold
				}, e.prototype.visibilityDidChange = function () {
					var e = this;
					"visible" === document.visibilityState && setTimeout(function () {
						!e.connectionIsStale() && e.connection.isOpen() || (o.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState), e.connection.reopen())
					}, 200)
				}, e
			}();
		p.pollInterval = {
			min: 3,
			max: 30,
			multiplier: 5
		}, p.staleThreshold = 6;
		var f = {
				message_types: {
					welcome: "welcome",
					disconnect: "disconnect",
					ping: "ping",
					confirmation: "confirm_subscription",
					rejection: "reject_subscription"
				},
				disconnect_reasons: {
					unauthorized: "unauthorized",
					invalid_request: "invalid_request",
					server_restart: "server_restart"
				},
				default_mount_path: "/cable",
				protocols: ["actioncable-v1-json", "actioncable-unsupported"]
			},
			h = f.message_types,
			m = f.protocols,
			g = m.slice(0, m.length - 1),
			v = [].indexOf,
			y = function () {
				function e(t) {
					a(this, e), this.open = this.open.bind(this), this.consumer = t, this.subscriptions = this.consumer.subscriptions, this.monitor = new p(this), this.disconnected = !0
				}
				return e.prototype.send = function (e) {
					return !!this.isOpen() && (this.webSocket.send(JSON.stringify(e)), !0)
				}, e.prototype.open = function () {
					return this.isActive() ? (o.log("Attempted to open WebSocket, but existing socket is " + this.getState()), !1) : (o.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + m), this.webSocket && this.uninstallEventHandlers(), this.webSocket = new r.WebSocket(this.consumer.url, m), this.installEventHandlers(), this.monitor.start(), !0)
				}, e.prototype.close = function () {
					if ((arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
							allowReconnect: !0
						}).allowReconnect || this.monitor.stop(), this.isActive()) return this.webSocket.close()
				}, e.prototype.reopen = function () {
					if (o.log("Reopening WebSocket, current state is " + this.getState()), !this.isActive()) return this.open();
					try {
						return this.close()
					} catch (e) {
						o.log("Failed to reopen WebSocket", e)
					} finally {
						o.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms"), setTimeout(this.open, this.constructor.reopenDelay)
					}
				}, e.prototype.getProtocol = function () {
					if (this.webSocket) return this.webSocket.protocol
				}, e.prototype.isOpen = function () {
					return this.isState("open")
				}, e.prototype.isActive = function () {
					return this.isState("open", "connecting")
				}, e.prototype.isProtocolSupported = function () {
					return v.call(g, this.getProtocol()) >= 0
				}, e.prototype.isState = function () {
					for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
					return v.call(t, this.getState()) >= 0
				}, e.prototype.getState = function () {
					if (this.webSocket)
						for (var e in r.WebSocket)
							if (r.WebSocket[e] === this.webSocket.readyState) return e.toLowerCase();
					return null
				}, e.prototype.installEventHandlers = function () {
					for (var e in this.events) {
						var t = this.events[e].bind(this);
						this.webSocket["on" + e] = t
					}
				}, e.prototype.uninstallEventHandlers = function () {
					for (var e in this.events) this.webSocket["on" + e] = function () {}
				}, e
			}();
		y.reopenDelay = 500, y.prototype.events = {
			message: function (e) {
				if (this.isProtocolSupported()) {
					var t = JSON.parse(e.data),
						n = t.identifier,
						i = t.message,
						r = t.reason,
						s = t.reconnect;
					switch (t.type) {
						case h.welcome:
							return this.monitor.recordConnect(), this.subscriptions.reload();
						case h.disconnect:
							return o.log("Disconnecting. Reason: " + r), this.close({
								allowReconnect: s
							});
						case h.ping:
							return this.monitor.recordPing();
						case h.confirmation:
							return this.subscriptions.notify(n, "connected");
						case h.rejection:
							return this.subscriptions.reject(n);
						default:
							return this.subscriptions.notify(n, "received", i)
					}
				}
			},
			open: function () {
				if (o.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol"), this.disconnected = !1, !this.isProtocolSupported()) return o.log("Protocol is unsupported. Stopping monitor and disconnecting."), this.close({
					allowReconnect: !1
				})
			},
			close: function () {
				if (o.log("WebSocket onclose event"), !this.disconnected) return this.disconnected = !0, this.monitor.recordDisconnect(), this.subscriptions.notifyAll("disconnected", {
					willAttemptReconnect: this.monitor.isRunning()
				})
			},
			error: function () {
				o.log("WebSocket onerror event")
			}
		};
		var A = function (e, t) {
				if (null != t)
					for (var n in t) {
						var i = t[n];
						e[n] = i
					}
				return e
			},
			b = function () {
				function e(t) {
					var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
						i = arguments[2];
					a(this, e), this.consumer = t, this.identifier = JSON.stringify(n), A(this, i)
				}
				return e.prototype.perform = function (e) {
					var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
					return t.action = e, this.send(t)
				}, e.prototype.send = function (e) {
					return this.consumer.send({
						command: "message",
						identifier: this.identifier,
						data: JSON.stringify(e)
					})
				}, e.prototype.unsubscribe = function () {
					return this.consumer.subscriptions.remove(this)
				}, e
			}(),
			w = function () {
				function e(t) {
					a(this, e), this.consumer = t, this.subscriptions = []
				}
				return e.prototype.create = function (e, t) {
					var n = e,
						i = "object" === (void 0 === n ? "undefined" : s(n)) ? n : {
							channel: n
						},
						r = new b(this.consumer, i, t);
					return this.add(r)
				}, e.prototype.add = function (e) {
					return this.subscriptions.push(e), this.consumer.ensureActiveConnection(), this.notify(e, "initialized"), this.sendCommand(e, "subscribe"), e
				}, e.prototype.remove = function (e) {
					return this.forget(e), this.findAll(e.identifier).length || this.sendCommand(e, "unsubscribe"), e
				}, e.prototype.reject = function (e) {
					var t = this;
					return this.findAll(e).map(function (e) {
						return t.forget(e), t.notify(e, "rejected"), e
					})
				}, e.prototype.forget = function (e) {
					return this.subscriptions = this.subscriptions.filter(function (t) {
						return t !== e
					}), e
				}, e.prototype.findAll = function (e) {
					return this.subscriptions.filter(function (t) {
						return t.identifier === e
					})
				}, e.prototype.reload = function () {
					var e = this;
					return this.subscriptions.map(function (t) {
						return e.sendCommand(t, "subscribe")
					})
				}, e.prototype.notifyAll = function (e) {
					for (var t = this, n = arguments.length, i = Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
					return this.subscriptions.map(function (n) {
						return t.notify.apply(t, [n, e].concat(i))
					})
				}, e.prototype.notify = function (e, t) {
					for (var n = arguments.length, i = Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++) i[r - 2] = arguments[r];
					return ("string" == typeof e ? this.findAll(e) : [e]).map(function (e) {
						return "function" == typeof e[t] ? e[t].apply(e, i) : undefined
					})
				}, e.prototype.sendCommand = function (e, t) {
					var n = e.identifier;
					return this.consumer.send({
						command: t,
						identifier: n
					})
				}, e
			}(),
			S = function () {
				function e(t) {
					a(this, e), this._url = t, this.subscriptions = new w(this), this.connection = new y(this)
				}
				return e.prototype.send = function (e) {
					return this.connection.send(e)
				}, e.prototype.connect = function () {
					return this.connection.open()
				}, e.prototype.disconnect = function () {
					return this.connection.close({
						allowReconnect: !1
					})
				}, e.prototype.ensureActiveConnection = function () {
					if (!this.connection.isActive()) return this.connection.open()
				}, c(e, [{
					key: "url",
					get: function () {
						return t(this._url)
					}
				}]), e
			}();
		e.Connection = y, e.ConnectionMonitor = p, e.Consumer = S, e.INTERNAL = f, e.Subscription = b, e.Subscriptions = w, e.adapters = r, e.createWebSocketURL = t, e.logger = o, e.createConsumer = n, e.getConfig = i, Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}),
	function () {
		this.App || (this.App = {}), App.cable = ActionCable.createConsumer()
	}.call(this),
	function (e) {
		if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
		else if ("function" == typeof define && define.amd) define([], e);
		else {
			("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).adapter = e()
		}
	}(function () {
		return function () {
			function e(t, n, i) {
				function r(s, a) {
					if (!n[s]) {
						if (!t[s]) {
							var c = "function" == typeof require && require;
							if (!a && c) return c(s, !0);
							if (o) return o(s, !0);
							var l = new Error("Cannot find module '" + s + "'");
							throw l.code = "MODULE_NOT_FOUND", l
						}
						var d = n[s] = {
							exports: {}
						};
						t[s][0].call(d.exports, function (e) {
							return r(t[s][1][e] || e)
						}, d, d.exports, e, t, n, i)
					}
					return n[s].exports
				}
				for (var o = "function" == typeof require && require, s = 0; s < i.length; s++) r(i[s]);
				return r
			}
			return e
		}()({
			1: [function (e, t) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";
				var n = (0, e("./adapter_factory.js").adapterFactory)({
					window: window
				});
				t.exports = n
			}, {
				"./adapter_factory.js": 2
			}],
			2: [function (e, t, n) {
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				function r() {
					var e = (arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}).window,
						t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
							shimChrome: !0,
							shimFirefox: !0,
							shimEdge: !0,
							shimSafari: !0
						},
						n = o.log,
						i = o.detectBrowser(e),
						r = {
							browserDetails: i,
							commonShim: d,
							extractVersion: o.extractVersion,
							disableLog: o.disableLog,
							disableWarnings: o.disableWarnings
						};
					switch (i.browser) {
						case "chrome":
							if (!s || !s.shimPeerConnection || !t.shimChrome) return n("Chrome shim is not included in this adapter release."), r;
							if (null === i.version) return n("Chrome shim can not determine version, not shimming."), r;
							n("adapter.js shimming chrome."), r.browserShim = s, s.shimGetUserMedia(e), s.shimMediaStream(e), s.shimPeerConnection(e), s.shimOnTrack(e), s.shimAddTrackRemoveTrack(e), s.shimGetSendersWithDtmf(e), s.shimGetStats(e), s.shimSenderReceiverGetStats(e), s.fixNegotiationNeeded(e), d.shimRTCIceCandidate(e), d.shimConnectionState(e), d.shimMaxMessageSize(e), d.shimSendThrowTypeError(e), d.removeAllowExtmapMixed(e);
							break;
						case "firefox":
							if (!c || !c.shimPeerConnection || !t.shimFirefox) return n("Firefox shim is not included in this adapter release."), r;
							n("adapter.js shimming firefox."), r.browserShim = c, c.shimGetUserMedia(e), c.shimPeerConnection(e), c.shimOnTrack(e), c.shimRemoveStream(e), c.shimSenderGetStats(e), c.shimReceiverGetStats(e), c.shimRTCDataChannel(e), c.shimAddTransceiver(e), c.shimCreateOffer(e), c.shimCreateAnswer(e), d.shimRTCIceCandidate(e), d.shimConnectionState(e), d.shimMaxMessageSize(e), d.shimSendThrowTypeError(e);
							break;
						case "edge":
							if (!a || !a.shimPeerConnection || !t.shimEdge) return n("MS edge shim is not included in this adapter release."), r;
							n("adapter.js shimming edge."), r.browserShim = a, a.shimGetUserMedia(e), a.shimGetDisplayMedia(e), a.shimPeerConnection(e), a.shimReplaceTrack(e), d.shimMaxMessageSize(e), d.shimSendThrowTypeError(e);
							break;
						case "safari":
							if (!l || !t.shimSafari) return n("Safari shim is not included in this adapter release."), r;
							n("adapter.js shimming safari."), r.browserShim = l, l.shimRTCIceServerUrls(e), l.shimCreateOfferLegacy(e), l.shimCallbacksAPI(e), l.shimLocalStreamsAPI(e), l.shimRemoteStreamsAPI(e), l.shimTrackEventTransceiver(e), l.shimGetUserMedia(e), l.shimAudioContext(e), d.shimRTCIceCandidate(e), d.shimMaxMessageSize(e), d.shimSendThrowTypeError(e), d.removeAllowExtmapMixed(e);
							break;
						default:
							n("Unsupported browser!")
					}
					return r
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.adapterFactory = r;
				var o = i(e("./utils")),
					s = i(e("./chrome/chrome_shim")),
					a = i(e("./edge/edge_shim")),
					c = i(e("./firefox/firefox_shim")),
					l = i(e("./safari/safari_shim")),
					d = i(e("./common_shim"))
			}, {
				"./chrome/chrome_shim": 3,
				"./common_shim": 6,
				"./edge/edge_shim": 7,
				"./firefox/firefox_shim": 11,
				"./safari/safari_shim": 14,
				"./utils": 15
			}],
			3: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e, t, n) {
					return t in e ? Object.defineProperty(e, t, {
						value: n,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : e[t] = n, e
				}

				function o(e) {
					e.MediaStream = e.MediaStream || e.webkitMediaStream
				}

				function s(e) {
					if ("object" !== (void 0 === e ? "undefined" : h(e)) || !e.RTCPeerConnection || "ontrack" in e.RTCPeerConnection.prototype) v.wrapPeerConnectionEvent(e, "track", function (e) {
						return e.transceiver || Object.defineProperty(e, "transceiver", {
							value: {
								receiver: e.receiver
							}
						}), e
					});
					else {
						Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
							get: function () {
								return this._ontrack
							},
							set: function (e) {
								this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e)
							},
							enumerable: !0,
							configurable: !0
						});
						var t = e.RTCPeerConnection.prototype.setRemoteDescription;
						e.RTCPeerConnection.prototype.setRemoteDescription = function () {
							var n = this;
							return this._ontrackpoly || (this._ontrackpoly = function (t) {
								t.stream.addEventListener("addtrack", function (i) {
									var r = void 0;
									r = e.RTCPeerConnection.prototype.getReceivers ? n.getReceivers().find(function (e) {
										return e.track && e.track.id === i.track.id
									}) : {
										track: i.track
									};
									var o = new Event("track");
									o.track = i.track, o.receiver = r, o.transceiver = {
										receiver: r
									}, o.streams = [t.stream], n.dispatchEvent(o)
								}), t.stream.getTracks().forEach(function (i) {
									var r = void 0;
									r = e.RTCPeerConnection.prototype.getReceivers ? n.getReceivers().find(function (e) {
										return e.track && e.track.id === i.id
									}) : {
										track: i
									};
									var o = new Event("track");
									o.track = i, o.receiver = r, o.transceiver = {
										receiver: r
									}, o.streams = [t.stream], n.dispatchEvent(o)
								})
							}, this.addEventListener("addstream", this._ontrackpoly)), t.apply(this, arguments)
						}
					}
				}

				function a(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
						var t = function (e, t) {
							return {
								track: t,
								get dtmf() {
									return this._dtmf === undefined && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null), this._dtmf
								},
								_pc: e
							}
						};
						if (!e.RTCPeerConnection.prototype.getSenders) {
							e.RTCPeerConnection.prototype.getSenders = function () {
								return this._senders = this._senders || [], this._senders.slice()
							};
							var n = e.RTCPeerConnection.prototype.addTrack;
							e.RTCPeerConnection.prototype.addTrack = function (e) {
								var i = n.apply(this, arguments);
								return i || (i = t(this, e), this._senders.push(i)), i
							};
							var i = e.RTCPeerConnection.prototype.removeTrack;
							e.RTCPeerConnection.prototype.removeTrack = function (e) {
								i.apply(this, arguments);
								var t = this._senders.indexOf(e); - 1 !== t && this._senders.splice(t, 1)
							}
						}
						var r = e.RTCPeerConnection.prototype.addStream;
						e.RTCPeerConnection.prototype.addStream = function (e) {
							var n = this;
							this._senders = this._senders || [], r.apply(this, [e]), e.getTracks().forEach(function (e) {
								n._senders.push(t(n, e))
							})
						};
						var o = e.RTCPeerConnection.prototype.removeStream;
						e.RTCPeerConnection.prototype.removeStream = function (e) {
							var t = this;
							this._senders = this._senders || [], o.apply(this, [e]), e.getTracks().forEach(function (e) {
								var n = t._senders.find(function (t) {
									return t.track === e
								});
								n && t._senders.splice(t._senders.indexOf(n), 1)
							})
						}
					} else if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
						var s = e.RTCPeerConnection.prototype.getSenders;
						e.RTCPeerConnection.prototype.getSenders = function () {
							var e = this,
								t = s.apply(this, []);
							return t.forEach(function (t) {
								return t._pc = e
							}), t
						}, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
							get: function () {
								return this._dtmf === undefined && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf
							}
						})
					}
				}

				function c(e) {
					if (e.RTCPeerConnection) {
						var t = e.RTCPeerConnection.prototype.getStats;
						e.RTCPeerConnection.prototype.getStats = function () {
							var e = this,
								n = Array.prototype.slice.call(arguments),
								i = n[0],
								r = n[1],
								o = n[2];
							if (arguments.length > 0 && "function" == typeof i) return t.apply(this, arguments);
							if (0 === t.length && (0 === arguments.length || "function" != typeof i)) return t.apply(this, []);
							var s = function (e) {
									var t = {};
									return e.result().forEach(function (e) {
										var n = {
											id: e.id,
											timestamp: e.timestamp,
											type: {
												localcandidate: "local-candidate",
												remotecandidate: "remote-candidate"
											} [e.type] || e.type
										};
										e.names().forEach(function (t) {
											n[t] = e.stat(t)
										}), t[n.id] = n
									}), t
								},
								a = function (e) {
									return new Map(Object.keys(e).map(function (t) {
										return [t, e[t]]
									}))
								};
							if (arguments.length >= 2) {
								var c = function (e) {
									r(a(s(e)))
								};
								return t.apply(this, [c, i])
							}
							return new Promise(function (n, i) {
								t.apply(e, [function (e) {
									n(a(s(e)))
								}, i])
							}).then(r, o)
						}
					}
				}

				function l(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver) {
						if (!("getStats" in e.RTCRtpSender.prototype)) {
							var t = e.RTCPeerConnection.prototype.getSenders;
							t && (e.RTCPeerConnection.prototype.getSenders = function () {
								var e = this,
									n = t.apply(this, []);
								return n.forEach(function (t) {
									return t._pc = e
								}), n
							});
							var n = e.RTCPeerConnection.prototype.addTrack;
							n && (e.RTCPeerConnection.prototype.addTrack = function () {
								var e = n.apply(this, arguments);
								return e._pc = this, e
							}), e.RTCRtpSender.prototype.getStats = function () {
								var e = this;
								return this._pc.getStats().then(function (t) {
									return v.filterStats(t, e.track, !0)
								})
							}
						}
						if (!("getStats" in e.RTCRtpReceiver.prototype)) {
							var i = e.RTCPeerConnection.prototype.getReceivers;
							i && (e.RTCPeerConnection.prototype.getReceivers = function () {
								var e = this,
									t = i.apply(this, []);
								return t.forEach(function (t) {
									return t._pc = e
								}), t
							}), v.wrapPeerConnectionEvent(e, "track", function (e) {
								return e.receiver._pc = e.srcElement, e
							}), e.RTCRtpReceiver.prototype.getStats = function () {
								var e = this;
								return this._pc.getStats().then(function (t) {
									return v.filterStats(t, e.track, !1)
								})
							}
						}
						if ("getStats" in e.RTCRtpSender.prototype && "getStats" in e.RTCRtpReceiver.prototype) {
							var r = e.RTCPeerConnection.prototype.getStats;
							e.RTCPeerConnection.prototype.getStats = function () {
								if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
									var t = arguments[0],
										n = void 0,
										i = void 0,
										o = void 0;
									return this.getSenders().forEach(function (e) {
										e.track === t && (n ? o = !0 : n = e)
									}), this.getReceivers().forEach(function (e) {
										return e.track === t && (i ? o = !0 : i = e), e.track === t
									}), o || n && i ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : n ? n.getStats() : i ? i.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"))
								}
								return r.apply(this, arguments)
							}
						}
					}
				}

				function d(e) {
					e.RTCPeerConnection.prototype.getLocalStreams = function () {
						var e = this;
						return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map(function (t) {
							return e._shimmedLocalStreams[t][0]
						})
					};
					var t = e.RTCPeerConnection.prototype.addTrack;
					e.RTCPeerConnection.prototype.addTrack = function (e, n) {
						if (!n) return t.apply(this, arguments);
						this._shimmedLocalStreams = this._shimmedLocalStreams || {};
						var i = t.apply(this, arguments);
						return this._shimmedLocalStreams[n.id] ? -1 === this._shimmedLocalStreams[n.id].indexOf(i) && this._shimmedLocalStreams[n.id].push(i) : this._shimmedLocalStreams[n.id] = [n, i], i
					};
					var n = e.RTCPeerConnection.prototype.addStream;
					e.RTCPeerConnection.prototype.addStream = function (e) {
						var t = this;
						this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach(function (e) {
							if (t.getSenders().find(function (t) {
									return t.track === e
								})) throw new DOMException("Track already exists.", "InvalidAccessError")
						});
						var i = this.getSenders();
						n.apply(this, arguments);
						var r = this.getSenders().filter(function (e) {
							return -1 === i.indexOf(e)
						});
						this._shimmedLocalStreams[e.id] = [e].concat(r)
					};
					var i = e.RTCPeerConnection.prototype.removeStream;
					e.RTCPeerConnection.prototype.removeStream = function (e) {
						return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], i.apply(this, arguments)
					};
					var r = e.RTCPeerConnection.prototype.removeTrack;
					e.RTCPeerConnection.prototype.removeTrack = function (e) {
						var t = this;
						return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e && Object.keys(this._shimmedLocalStreams).forEach(function (n) {
							var i = t._shimmedLocalStreams[n].indexOf(e); - 1 !== i && t._shimmedLocalStreams[n].splice(i, 1), 1 === t._shimmedLocalStreams[n].length && delete t._shimmedLocalStreams[n]
						}), r.apply(this, arguments)
					}
				}

				function u(e) {
					function t(e, t) {
						var n = t.sdp;
						return Object.keys(e._reverseStreams || []).forEach(function (t) {
							var i = e._reverseStreams[t],
								r = e._streams[i.id];
							n = n.replace(new RegExp(r.id, "g"), i.id)
						}), new RTCSessionDescription({
							type: t.type,
							sdp: n
						})
					}

					function n(e, t) {
						var n = t.sdp;
						return Object.keys(e._reverseStreams || []).forEach(function (t) {
							var i = e._reverseStreams[t],
								r = e._streams[i.id];
							n = n.replace(new RegExp(i.id, "g"), r.id)
						}), new RTCSessionDescription({
							type: t.type,
							sdp: n
						})
					}
					if (e.RTCPeerConnection) {
						var i = v.detectBrowser(e);
						if (e.RTCPeerConnection.prototype.addTrack && i.version >= 65) return d(e);
						var o = e.RTCPeerConnection.prototype.getLocalStreams;
						e.RTCPeerConnection.prototype.getLocalStreams = function () {
							var e = this,
								t = o.apply(this);
							return this._reverseStreams = this._reverseStreams || {}, t.map(function (t) {
								return e._reverseStreams[t.id]
							})
						};
						var s = e.RTCPeerConnection.prototype.addStream;
						e.RTCPeerConnection.prototype.addStream = function (t) {
							var n = this;
							if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, t.getTracks().forEach(function (e) {
									if (n.getSenders().find(function (t) {
											return t.track === e
										})) throw new DOMException("Track already exists.", "InvalidAccessError")
								}), !this._reverseStreams[t.id]) {
								var i = new e.MediaStream(t.getTracks());
								this._streams[t.id] = i, this._reverseStreams[i.id] = t, t = i
							}
							s.apply(this, [t])
						};
						var a = e.RTCPeerConnection.prototype.removeStream;
						e.RTCPeerConnection.prototype.removeStream = function (e) {
							this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, a.apply(this, [this._streams[e.id] || e]), delete this._reverseStreams[this._streams[e.id] ? this._streams[e.id].id : e.id], delete this._streams[e.id]
						}, e.RTCPeerConnection.prototype.addTrack = function (t, n) {
							var i = this;
							if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
							var r = [].slice.call(arguments, 1);
							if (1 !== r.length || !r[0].getTracks().find(function (e) {
									return e === t
								})) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
							if (this.getSenders().find(function (e) {
									return e.track === t
								})) throw new DOMException("Track already exists.", "InvalidAccessError");
							this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
							var o = this._streams[n.id];
							if (o) o.addTrack(t), Promise.resolve().then(function () {
								i.dispatchEvent(new Event("negotiationneeded"))
							});
							else {
								var s = new e.MediaStream([t]);
								this._streams[n.id] = s, this._reverseStreams[s.id] = n, this.addStream(s)
							}
							return this.getSenders().find(function (e) {
								return e.track === t
							})
						}, ["createOffer", "createAnswer"].forEach(function (n) {
							var i = e.RTCPeerConnection.prototype[n],
								o = r({}, n, function () {
									var e = this,
										n = arguments;
									return arguments.length && "function" == typeof arguments[0] ? i.apply(this, [function (i) {
										var r = t(e, i);
										n[0].apply(null, [r])
									}, function (e) {
										n[1] && n[1].apply(null, e)
									}, arguments[2]]) : i.apply(this, arguments).then(function (n) {
										return t(e, n)
									})
								});
							e.RTCPeerConnection.prototype[n] = o[n]
						});
						var c = e.RTCPeerConnection.prototype.setLocalDescription;
						e.RTCPeerConnection.prototype.setLocalDescription = function () {
							return arguments.length && arguments[0].type ? (arguments[0] = n(this, arguments[0]), c.apply(this, arguments)) : c.apply(this, arguments)
						};
						var l = Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype, "localDescription");
						Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", {
							get: function () {
								var e = l.get.apply(this);
								return "" === e.type ? e : t(this, e)
							}
						}), e.RTCPeerConnection.prototype.removeTrack = function (e) {
							var t = this;
							if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
							if (!e._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
							if (!(e._pc === this)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
							this._streams = this._streams || {};
							var n = void 0;
							Object.keys(this._streams).forEach(function (i) {
								t._streams[i].getTracks().find(function (t) {
									return e.track === t
								}) && (n = t._streams[i])
							}), n && (1 === n.getTracks().length ? this.removeStream(this._reverseStreams[n.id]) : n.removeTrack(e.track), this.dispatchEvent(new Event("negotiationneeded")))
						}
					}
				}

				function p(e) {
					var t = v.detectBrowser(e);
					if (!e.RTCPeerConnection && e.webkitRTCPeerConnection && (e.RTCPeerConnection = e.webkitRTCPeerConnection), e.RTCPeerConnection) {
						var n = 0 === e.RTCPeerConnection.prototype.addIceCandidate.length;
						t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (t) {
							var n = e.RTCPeerConnection.prototype[t],
								i = r({}, t, function () {
									return arguments[0] = new("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments)
								});
							e.RTCPeerConnection.prototype[t] = i[t]
						});
						var i = e.RTCPeerConnection.prototype.addIceCandidate;
						e.RTCPeerConnection.prototype.addIceCandidate = function () {
							return n || arguments[0] ? t.version < 78 && arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : i.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
						}
					}
				}

				function f(e) {
					var t = v.detectBrowser(e);
					v.wrapPeerConnectionEvent(e, "negotiationneeded", function (e) {
						var n = e.target;
						if (!(t.version < 72 || n.getConfiguration && "plan-b" === n.getConfiguration().sdpSemantics) || "stable" === n.signalingState) return e
					})
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = n.shimGetUserMedia = undefined;
				var h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
						return typeof e
					} : function (e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					},
					m = e("./getusermedia");
				Object.defineProperty(n, "shimGetUserMedia", {
					enumerable: !0,
					get: function () {
						return m.shimGetUserMedia
					}
				});
				var g = e("./getdisplaymedia");
				Object.defineProperty(n, "shimGetDisplayMedia", {
					enumerable: !0,
					get: function () {
						return g.shimGetDisplayMedia
					}
				}), n.shimMediaStream = o, n.shimOnTrack = s, n.shimGetSendersWithDtmf = a, n.shimGetStats = c, n.shimSenderReceiverGetStats = l, n.shimAddTrackRemoveTrackWithNative = d, n.shimAddTrackRemoveTrack = u, n.shimPeerConnection = p, n.fixNegotiationNeeded = f;
				var v = i(e("../utils.js"))
			}, {
				"../utils.js": 15,
				"./getdisplaymedia": 4,
				"./getusermedia": 5
			}],
			4: [function (e, t, n) {
				/*
				 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e, t) {
					e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || e.navigator.mediaDevices && ("function" == typeof t ? e.navigator.mediaDevices.getDisplayMedia = function (n) {
						return t(n).then(function (t) {
							var i = n.video && n.video.width,
								r = n.video && n.video.height,
								o = n.video && n.video.frameRate;
							return n.video = {
								mandatory: {
									chromeMediaSource: "desktop",
									chromeMediaSourceId: t,
									maxFrameRate: o || 3
								}
							}, i && (n.video.mandatory.maxWidth = i), r && (n.video.mandatory.maxHeight = r), e.navigator.mediaDevices.getUserMedia(n)
						})
					} : console.error("shimGetDisplayMedia: getSourceId argument is not a function"))
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = i
			}, {}],
			5: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e) {
					var t = e && e.navigator;
					if (t.mediaDevices) {
						var n = s.detectBrowser(e),
							i = function (e) {
								if ("object" !== (void 0 === e ? "undefined" : o(e)) || e.mandatory || e.optional) return e;
								var t = {};
								return Object.keys(e).forEach(function (n) {
									if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
										var i = "object" === o(e[n]) ? e[n] : {
											ideal: e[n]
										};
										i.exact !== undefined && "number" == typeof i.exact && (i.min = i.max = i.exact);
										var r = function (e, t) {
											return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
										};
										if (i.ideal !== undefined) {
											t.optional = t.optional || [];
											var s = {};
											"number" == typeof i.ideal ? (s[r("min", n)] = i.ideal, t.optional.push(s), (s = {})[r("max", n)] = i.ideal, t.optional.push(s)) : (s[r("", n)] = i.ideal, t.optional.push(s))
										}
										i.exact !== undefined && "number" != typeof i.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[r("", n)] = i.exact) : ["min", "max"].forEach(function (e) {
											i[e] !== undefined && (t.mandatory = t.mandatory || {}, t.mandatory[r(e, n)] = i[e])
										})
									}
								}), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t
							},
							r = function (e, r) {
								if (n.version >= 61) return r(e);
								if ((e = JSON.parse(JSON.stringify(e))) && "object" === o(e.audio)) {
									var s = function (e, t, n) {
										t in e && !(n in e) && (e[n] = e[t], delete e[t])
									};
									s((e = JSON.parse(JSON.stringify(e))).audio, "autoGainControl", "googAutoGainControl"), s(e.audio, "noiseSuppression", "googNoiseSuppression"), e.audio = i(e.audio)
								}
								if (e && "object" === o(e.video)) {
									var c = e.video.facingMode;
									c = c && ("object" === (void 0 === c ? "undefined" : o(c)) ? c : {
										ideal: c
									});
									var l = n.version < 66;
									if (c && ("user" === c.exact || "environment" === c.exact || "user" === c.ideal || "environment" === c.ideal) && (!t.mediaDevices.getSupportedConstraints || !t.mediaDevices.getSupportedConstraints().facingMode || l)) {
										delete e.video.facingMode;
										var d = void 0;
										if ("environment" === c.exact || "environment" === c.ideal ? d = ["back", "rear"] : "user" !== c.exact && "user" !== c.ideal || (d = ["front"]), d) return t.mediaDevices.enumerateDevices().then(function (t) {
											var n = (t = t.filter(function (e) {
												return "videoinput" === e.kind
											})).find(function (e) {
												return d.some(function (t) {
													return e.label.toLowerCase().includes(t)
												})
											});
											return !n && t.length && d.includes("back") && (n = t[t.length - 1]), n && (e.video.deviceId = c.exact ? {
												exact: n.deviceId
											} : {
												ideal: n.deviceId
											}), e.video = i(e.video), a("chrome: " + JSON.stringify(e)), r(e)
										})
									}
									e.video = i(e.video)
								}
								return a("chrome: " + JSON.stringify(e)), r(e)
							},
							c = function (e) {
								return n.version >= 64 ? e : {
									name: {
										PermissionDeniedError: "NotAllowedError",
										PermissionDismissedError: "NotAllowedError",
										InvalidStateError: "NotAllowedError",
										DevicesNotFoundError: "NotFoundError",
										ConstraintNotSatisfiedError: "OverconstrainedError",
										TrackStartError: "NotReadableError",
										MediaDeviceFailedDueToShutdown: "NotAllowedError",
										MediaDeviceKillSwitchOn: "NotAllowedError",
										TabCaptureError: "AbortError",
										ScreenCaptureError: "AbortError",
										DeviceCaptureError: "AbortError"
									} [e.name] || e.name,
									message: e.message,
									constraint: e.constraint || e.constraintName,
									toString: function () {
										return this.name + (this.message && ": ") + this.message
									}
								}
							},
							l = function (e, n, i) {
								r(e, function (e) {
									t.webkitGetUserMedia(e, n, function (e) {
										i && i(c(e))
									})
								})
							};
						if (t.getUserMedia = l.bind(t), t.mediaDevices.getUserMedia) {
							var d = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
							t.mediaDevices.getUserMedia = function (e) {
								return r(e, function (e) {
									return d(e).then(function (t) {
										if (e.audio && !t.getAudioTracks().length || e.video && !t.getVideoTracks().length) throw t.getTracks().forEach(function (e) {
											e.stop()
										}), new DOMException("", "NotFoundError");
										return t
									}, function (e) {
										return Promise.reject(c(e))
									})
								})
							}
						}
					}
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				};
				n.shimGetUserMedia = r;
				var s = i(e("../utils.js")),
					a = s.log
			}, {
				"../utils.js": 15
			}],
			6: [function (e, t, n) {
				/*
				 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function o(e) {
					if (e.RTCIceCandidate && !(e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype)) {
						var t = e.RTCIceCandidate;
						e.RTCIceCandidate = function (e) {
							if ("object" === (void 0 === e ? "undefined" : d(e)) && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substr(2)), e.candidate && e.candidate.length) {
								var n = new t(e),
									i = u["default"].parseCandidate(e.candidate),
									r = Object.assign(n, i);
								return r.toJSON = function () {
									return {
										candidate: r.candidate,
										sdpMid: r.sdpMid,
										sdpMLineIndex: r.sdpMLineIndex,
										usernameFragment: r.usernameFragment
									}
								}, r
							}
							return new t(e)
						}, e.RTCIceCandidate.prototype = t.prototype, p.wrapPeerConnectionEvent(e, "icecandidate", function (t) {
							return t.candidate && Object.defineProperty(t, "candidate", {
								value: new e.RTCIceCandidate(t.candidate),
								writable: "false"
							}), t
						})
					}
				}

				function s(e) {
					if (e.RTCPeerConnection) {
						var t = p.detectBrowser(e);
						"sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
							get: function () {
								return "undefined" == typeof this._sctp ? null : this._sctp
							}
						});
						var n = function (e) {
								if (!e || !e.sdp) return !1;
								var t = u["default"].splitSections(e.sdp);
								return t.shift(), t.some(function (e) {
									var t = u["default"].parseMLine(e);
									return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP")
								})
							},
							i = function (e) {
								var t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
								if (null === t || t.length < 2) return -1;
								var n = parseInt(t[1], 10);
								return n != n ? -1 : n
							},
							r = function (e) {
								var n = 65536;
								return "firefox" === t.browser && (n = t.version < 57 ? -1 === e ? 16384 : 2147483637 : t.version < 60 ? 57 === t.version ? 65535 : 65536 : 2147483637), n
							},
							o = function (e, n) {
								var i = 65536;
								"firefox" === t.browser && 57 === t.version && (i = 65535);
								var r = u["default"].matchPrefix(e.sdp, "a=max-message-size:");
								return r.length > 0 ? i = parseInt(r[0].substr(19), 10) : "firefox" === t.browser && -1 !== n && (i = 2147483637), i
							},
							s = e.RTCPeerConnection.prototype.setRemoteDescription;
						e.RTCPeerConnection.prototype.setRemoteDescription = function () {
							(this._sctp = null, "chrome" === t.browser && t.version >= 76) && ("plan-b" === this.getConfiguration().sdpSemantics && Object.defineProperty(this, "sctp", {
								get: function () {
									return "undefined" == typeof this._sctp ? null : this._sctp
								},
								enumerable: !0,
								configurable: !0
							}));
							if (n(arguments[0])) {
								var e = i(arguments[0]),
									a = r(e),
									c = o(arguments[0], e),
									l = void 0;
								l = 0 === a && 0 === c ? Number.POSITIVE_INFINITY : 0 === a || 0 === c ? Math.max(a, c) : Math.min(a, c);
								var d = {};
								Object.defineProperty(d, "maxMessageSize", {
									get: function () {
										return l
									}
								}), this._sctp = d
							}
							return s.apply(this, arguments)
						}
					}
				}

				function a(e) {
					function t(e, t) {
						var n = e.send;
						e.send = function () {
							var i = arguments[0],
								r = i.length || i.size || i.byteLength;
							if ("open" === e.readyState && t.sctp && r > t.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)");
							return n.apply(e, arguments)
						}
					}
					if (e.RTCPeerConnection && "createDataChannel" in e.RTCPeerConnection.prototype) {
						var n = e.RTCPeerConnection.prototype.createDataChannel;
						e.RTCPeerConnection.prototype.createDataChannel = function () {
							var e = n.apply(this, arguments);
							return t(e, this), e
						}, p.wrapPeerConnectionEvent(e, "datachannel", function (e) {
							return t(e.channel, e.target), e
						})
					}
				}

				function c(e) {
					if (e.RTCPeerConnection && !("connectionState" in e.RTCPeerConnection.prototype)) {
						var t = e.RTCPeerConnection.prototype;
						Object.defineProperty(t, "connectionState", {
							get: function () {
								return {
									completed: "connected",
									checking: "connecting"
								} [this.iceConnectionState] || this.iceConnectionState
							},
							enumerable: !0,
							configurable: !0
						}), Object.defineProperty(t, "onconnectionstatechange", {
							get: function () {
								return this._onconnectionstatechange || null
							},
							set: function (e) {
								this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), e && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e)
							},
							enumerable: !0,
							configurable: !0
						}), ["setLocalDescription", "setRemoteDescription"].forEach(function (e) {
							var n = t[e];
							t[e] = function () {
								return this._connectionstatechangepoly || (this._connectionstatechangepoly = function (e) {
									var t = e.target;
									if (t._lastConnectionState !== t.connectionState) {
										t._lastConnectionState = t.connectionState;
										var n = new Event("connectionstatechange", e);
										t.dispatchEvent(n)
									}
									return e
								}, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), n.apply(this, arguments)
							}
						})
					}
				}

				function l(e) {
					if (e.RTCPeerConnection) {
						var t = p.detectBrowser(e);
						if (!("chrome" === t.browser && t.version >= 71)) {
							var n = e.RTCPeerConnection.prototype.setRemoteDescription;
							e.RTCPeerConnection.prototype.setRemoteDescription = function (e) {
								return e && e.sdp && -1 !== e.sdp.indexOf("\na=extmap-allow-mixed") && (e.sdp = e.sdp.split("\n").filter(function (e) {
									return "a=extmap-allow-mixed" !== e.trim()
								}).join("\n")), n.apply(this, arguments)
							}
						}
					}
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				};
				n.shimRTCIceCandidate = o, n.shimMaxMessageSize = s, n.shimSendThrowTypeError = a, n.shimConnectionState = c, n.removeAllowExtmapMixed = l;
				var u = r(e("sdp")),
					p = i(e("./utils"))
			}, {
				"./utils": 15,
				sdp: 17
			}],
			7: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function r(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function o(e) {
					var t = l.detectBrowser(e);
					if (e.RTCIceGatherer && (e.RTCIceCandidate || (e.RTCIceCandidate = function (e) {
							return e
						}), e.RTCSessionDescription || (e.RTCSessionDescription = function (e) {
							return e
						}), t.version < 15025)) {
						var n = Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype, "enabled");
						Object.defineProperty(e.MediaStreamTrack.prototype, "enabled", {
							set: function (e) {
								n.set.call(this, e);
								var t = new Event("enabled");
								t.enabled = e, this.dispatchEvent(t)
							}
						})
					}!e.RTCRtpSender || "dtmf" in e.RTCRtpSender.prototype || Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
						get: function () {
							return this._dtmf === undefined && ("audio" === this.track.kind ? this._dtmf = new e.RTCDtmfSender(this) : "video" === this.track.kind && (this._dtmf = null)), this._dtmf
						}
					}), e.RTCDtmfSender && !e.RTCDTMFSender && (e.RTCDTMFSender = e.RTCDtmfSender);
					var i = (0, u["default"])(e, t.version);
					e.RTCPeerConnection = function (e) {
						return e && e.iceServers && (e.iceServers = (0, d.filterIceServers)(e.iceServers, t.version), l.log("ICE servers after filtering:", e.iceServers)), new i(e)
					}, e.RTCPeerConnection.prototype = i.prototype
				}

				function s(e) {
					!e.RTCRtpSender || "replaceTrack" in e.RTCRtpSender.prototype || (e.RTCRtpSender.prototype.replaceTrack = e.RTCRtpSender.prototype.setTrack)
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = n.shimGetUserMedia = undefined;
				var a = e("./getusermedia");
				Object.defineProperty(n, "shimGetUserMedia", {
					enumerable: !0,
					get: function () {
						return a.shimGetUserMedia
					}
				});
				var c = e("./getdisplaymedia");
				Object.defineProperty(n, "shimGetDisplayMedia", {
					enumerable: !0,
					get: function () {
						return c.shimGetDisplayMedia
					}
				}), n.shimPeerConnection = o, n.shimReplaceTrack = s;
				var l = r(e("../utils")),
					d = e("./filtericeservers"),
					u = i(e("rtcpeerconnection-shim"))
			}, {
				"../utils": 15,
				"./filtericeservers": 8,
				"./getdisplaymedia": 9,
				"./getusermedia": 10,
				"rtcpeerconnection-shim": 16
			}],
			8: [function (e, t, n) {
				/*
				 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e) {
					var t = !1;
					return (e = JSON.parse(JSON.stringify(e))).filter(function (e) {
						if (e && (e.urls || e.url)) {
							var n = e.urls || e.url;
							e.url && !e.urls && o.deprecated("RTCIceServer.url", "RTCIceServer.urls");
							var i = "string" == typeof n;
							return i && (n = [n]), n = n.filter(function (e) {
								if (0 === e.indexOf("stun:")) return !1;
								var n = e.startsWith("turn") && !e.startsWith("turn:[") && e.includes("transport=udp");
								return n && !t ? (t = !0, !0) : n && !t
							}), delete e.url, e.urls = i ? n[0] : n, !!n.length
						}
					})
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.filterIceServers = r;
				var o = i(e("../utils"))
			}, {
				"../utils": 15
			}],
			9: [function (e, t, n) {
				/*
				 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					"getDisplayMedia" in e.navigator && e.navigator.mediaDevices && (e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || (e.navigator.mediaDevices.getDisplayMedia = e.navigator.getDisplayMedia.bind(e.navigator)))
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = i
			}, {}],
			10: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					var t = e && e.navigator,
						n = function (e) {
							return {
								name: {
									PermissionDeniedError: "NotAllowedError"
								} [e.name] || e.name,
								message: e.message,
								constraint: e.constraint,
								toString: function () {
									return this.name
								}
							}
						},
						i = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
					t.mediaDevices.getUserMedia = function (e) {
						return i(e)["catch"](function (e) {
							return Promise.reject(n(e))
						})
					}
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetUserMedia = i
			}, {}],
			11: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e, t, n) {
					return t in e ? Object.defineProperty(e, t, {
						value: n,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : e[t] = n, e
				}

				function o(e) {
					"object" === (void 0 === e ? "undefined" : h(e)) && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
						get: function () {
							return {
								receiver: this.receiver
							}
						}
					})
				}

				function s(e) {
					var t = v.detectBrowser(e);
					if ("object" === (void 0 === e ? "undefined" : h(e)) && (e.RTCPeerConnection || e.mozRTCPeerConnection)) {
						if (!e.RTCPeerConnection && e.mozRTCPeerConnection && (e.RTCPeerConnection = e.mozRTCPeerConnection), t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (t) {
								var n = e.RTCPeerConnection.prototype[t],
									i = r({}, t, function () {
										return arguments[0] = new("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments)
									});
								e.RTCPeerConnection.prototype[t] = i[t]
							}), t.version < 68) {
							var n = e.RTCPeerConnection.prototype.addIceCandidate;
							e.RTCPeerConnection.prototype.addIceCandidate = function () {
								return arguments[0] ? arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : n.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
							}
						}
						var i = {
								inboundrtp: "inbound-rtp",
								outboundrtp: "outbound-rtp",
								candidatepair: "candidate-pair",
								localcandidate: "local-candidate",
								remotecandidate: "remote-candidate"
							},
							o = e.RTCPeerConnection.prototype.getStats;
						e.RTCPeerConnection.prototype.getStats = function () {
							var e = Array.prototype.slice.call(arguments),
								n = e[0],
								r = e[1],
								s = e[2];
							return o.apply(this, [n || null]).then(function (e) {
								if (t.version < 53 && !r) try {
									e.forEach(function (e) {
										e.type = i[e.type] || e.type
									})
								} catch (n) {
									if ("TypeError" !== n.name) throw n;
									e.forEach(function (t, n) {
										e.set(n, Object.assign({}, t, {
											type: i[t.type] || t.type
										}))
									})
								}
								return e
							}).then(r, s)
						}
					}
				}

				function a(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection && e.RTCRtpSender && !(e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype)) {
						var t = e.RTCPeerConnection.prototype.getSenders;
						t && (e.RTCPeerConnection.prototype.getSenders = function () {
							var e = this,
								n = t.apply(this, []);
							return n.forEach(function (t) {
								return t._pc = e
							}), n
						});
						var n = e.RTCPeerConnection.prototype.addTrack;
						n && (e.RTCPeerConnection.prototype.addTrack = function () {
							var e = n.apply(this, arguments);
							return e._pc = this, e
						}), e.RTCRtpSender.prototype.getStats = function () {
							return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map)
						}
					}
				}

				function c(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection && e.RTCRtpSender && !(e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype)) {
						var t = e.RTCPeerConnection.prototype.getReceivers;
						t && (e.RTCPeerConnection.prototype.getReceivers = function () {
							var e = this,
								n = t.apply(this, []);
							return n.forEach(function (t) {
								return t._pc = e
							}), n
						}), v.wrapPeerConnectionEvent(e, "track", function (e) {
							return e.receiver._pc = e.srcElement, e
						}), e.RTCRtpReceiver.prototype.getStats = function () {
							return this._pc.getStats(this.track)
						}
					}
				}

				function l(e) {
					!e.RTCPeerConnection || "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
						var t = this;
						v.deprecated("removeStream", "removeTrack"), this.getSenders().forEach(function (n) {
							n.track && e.getTracks().includes(n.track) && t.removeTrack(n)
						})
					})
				}

				function d(e) {
					e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel)
				}

				function u(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection) {
						var t = e.RTCPeerConnection.prototype.addTransceiver;
						t && (e.RTCPeerConnection.prototype.addTransceiver = function () {
							this.setParametersPromises = [];
							var e = arguments[1],
								n = e && "sendEncodings" in e;
							n && e.sendEncodings.forEach(function (e) {
								if ("rid" in e && !/^[a-z0-9]{0,16}$/i.test(e.rid)) throw new TypeError("Invalid RID value provided.");
								if ("scaleResolutionDownBy" in e && !(parseFloat(e.scaleResolutionDownBy) >= 1)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
								if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0")
							});
							var i = t.apply(this, arguments);
							if (n) {
								var r = i.sender,
									o = r.getParameters();
								"encodings" in o || (o.encodings = e.sendEncodings, this.setParametersPromises.push(r.setParameters(o)["catch"](function () {})))
							}
							return i
						})
					}
				}

				function p(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection) {
						var t = e.RTCPeerConnection.prototype.createOffer;
						e.RTCPeerConnection.prototype.createOffer = function () {
							var e = this,
								n = arguments;
							return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(function () {
								return t.apply(e, n)
							})["finally"](function () {
								e.setParametersPromises = []
							}) : t.apply(this, arguments)
						}
					}
				}

				function f(e) {
					if ("object" === (void 0 === e ? "undefined" : h(e)) && e.RTCPeerConnection) {
						var t = e.RTCPeerConnection.prototype.createAnswer;
						e.RTCPeerConnection.prototype.createAnswer = function () {
							var e = this,
								n = arguments;
							return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(function () {
								return t.apply(e, n)
							})["finally"](function () {
								e.setParametersPromises = []
							}) : t.apply(this, arguments)
						}
					}
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = n.shimGetUserMedia = undefined;
				var h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
						return typeof e
					} : function (e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					},
					m = e("./getusermedia");
				Object.defineProperty(n, "shimGetUserMedia", {
					enumerable: !0,
					get: function () {
						return m.shimGetUserMedia
					}
				});
				var g = e("./getdisplaymedia");
				Object.defineProperty(n, "shimGetDisplayMedia", {
					enumerable: !0,
					get: function () {
						return g.shimGetDisplayMedia
					}
				}), n.shimOnTrack = o, n.shimPeerConnection = s, n.shimSenderGetStats = a, n.shimReceiverGetStats = c, n.shimRemoveStream = l, n.shimRTCDataChannel = d, n.shimAddTransceiver = u, n.shimCreateOffer = p, n.shimCreateAnswer = f;
				var v = i(e("../utils"))
			}, {
				"../utils": 15,
				"./getdisplaymedia": 12,
				"./getusermedia": 13
			}],
			12: [function (e, t, n) {
				/*
				 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e, t) {
					e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || e.navigator.mediaDevices && (e.navigator.mediaDevices.getDisplayMedia = function (n) {
						if (!n || !n.video) {
							var i = new DOMException("getDisplayMedia without video constraints is undefined");
							return i.name = "NotFoundError", i.code = 8, Promise.reject(i)
						}
						return !0 === n.video ? n.video = {
							mediaSource: t
						} : n.video.mediaSource = t, e.navigator.mediaDevices.getUserMedia(n)
					})
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				}), n.shimGetDisplayMedia = i
			}, {}],
			13: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e) {
					var t = s.detectBrowser(e),
						n = e && e.navigator,
						i = e && e.MediaStreamTrack;
					if (n.getUserMedia = function (e, t, i) {
							s.deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), n.mediaDevices.getUserMedia(e).then(t, i)
						}, !(t.version > 55 && "autoGainControl" in n.mediaDevices.getSupportedConstraints())) {
						var r = function (e, t, n) {
								t in e && !(n in e) && (e[n] = e[t], delete e[t])
							},
							a = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
						if (n.mediaDevices.getUserMedia = function (e) {
								return "object" === (void 0 === e ? "undefined" : o(e)) && "object" === o(e.audio) && (e = JSON.parse(JSON.stringify(e)), r(e.audio, "autoGainControl", "mozAutoGainControl"), r(e.audio, "noiseSuppression", "mozNoiseSuppression")), a(e)
							}, i && i.prototype.getSettings) {
							var c = i.prototype.getSettings;
							i.prototype.getSettings = function () {
								var e = c.apply(this, arguments);
								return r(e, "mozAutoGainControl", "autoGainControl"), r(e, "mozNoiseSuppression", "noiseSuppression"), e
							}
						}
						if (i && i.prototype.applyConstraints) {
							var l = i.prototype.applyConstraints;
							i.prototype.applyConstraints = function (e) {
								return "audio" === this.kind && "object" === (void 0 === e ? "undefined" : o(e)) && (e = JSON.parse(JSON.stringify(e)), r(e, "autoGainControl", "mozAutoGainControl"), r(e, "noiseSuppression", "mozNoiseSuppression")), l.apply(this, [e])
							}
						}
					}
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				};
				n.shimGetUserMedia = r;
				var s = i(e("../utils"))
			}, {
				"../utils": 15
			}],
			14: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e)
						for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
					return t["default"] = e, t
				}

				function r(e) {
					if ("object" === (void 0 === e ? "undefined" : f(e)) && e.RTCPeerConnection) {
						if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function () {
								return this._localStreams || (this._localStreams = []), this._localStreams
							}), !("addStream" in e.RTCPeerConnection.prototype)) {
							var t = e.RTCPeerConnection.prototype.addTrack;
							e.RTCPeerConnection.prototype.addStream = function (e) {
								var n = this;
								this._localStreams || (this._localStreams = []), this._localStreams.includes(e) || this._localStreams.push(e), e.getAudioTracks().forEach(function (i) {
									return t.call(n, i, e)
								}), e.getVideoTracks().forEach(function (i) {
									return t.call(n, i, e)
								})
							}, e.RTCPeerConnection.prototype.addTrack = function () {
								for (var e = this, n = arguments.length, i = Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
								return i && i.forEach(function (t) {
									e._localStreams ? e._localStreams.includes(t) || e._localStreams.push(t) : e._localStreams = [t]
								}), t.apply(this, arguments)
							}
						}
						"removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
							var t = this;
							this._localStreams || (this._localStreams = []);
							var n = this._localStreams.indexOf(e);
							if (-1 !== n) {
								this._localStreams.splice(n, 1);
								var i = e.getTracks();
								this.getSenders().forEach(function (e) {
									i.includes(e.track) && t.removeTrack(e)
								})
							}
						})
					}
				}

				function o(e) {
					if ("object" === (void 0 === e ? "undefined" : f(e)) && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
							return this._remoteStreams ? this._remoteStreams : []
						}), !("onaddstream" in e.RTCPeerConnection.prototype))) {
						Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
							get: function () {
								return this._onaddstream
							},
							set: function (e) {
								var t = this;
								this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = function (e) {
									e.streams.forEach(function (e) {
										if (t._remoteStreams || (t._remoteStreams = []), !t._remoteStreams.includes(e)) {
											t._remoteStreams.push(e);
											var n = new Event("addstream");
											n.stream = e, t.dispatchEvent(n)
										}
									})
								})
							}
						});
						var t = e.RTCPeerConnection.prototype.setRemoteDescription;
						e.RTCPeerConnection.prototype.setRemoteDescription = function () {
							var e = this;
							return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function (t) {
								t.streams.forEach(function (t) {
									if (e._remoteStreams || (e._remoteStreams = []), !(e._remoteStreams.indexOf(t) >= 0)) {
										e._remoteStreams.push(t);
										var n = new Event("addstream");
										n.stream = t, e.dispatchEvent(n)
									}
								})
							}), t.apply(e, arguments)
						}
					}
				}

				function s(e) {
					if ("object" === (void 0 === e ? "undefined" : f(e)) && e.RTCPeerConnection) {
						var t = e.RTCPeerConnection.prototype,
							n = t.createOffer,
							i = t.createAnswer,
							r = t.setLocalDescription,
							o = t.setRemoteDescription,
							s = t.addIceCandidate;
						t.createOffer = function (e, t) {
							var i = arguments.length >= 2 ? arguments[2] : arguments[0],
								r = n.apply(this, [i]);
							return t ? (r.then(e, t), Promise.resolve()) : r
						}, t.createAnswer = function (e, t) {
							var n = arguments.length >= 2 ? arguments[2] : arguments[0],
								r = i.apply(this, [n]);
							return t ? (r.then(e, t), Promise.resolve()) : r
						};
						var a = function (e, t, n) {
							var i = r.apply(this, [e]);
							return n ? (i.then(t, n), Promise.resolve()) : i
						};
						t.setLocalDescription = a, a = function (e, t, n) {
							var i = o.apply(this, [e]);
							return n ? (i.then(t, n), Promise.resolve()) : i
						}, t.setRemoteDescription = a, a = function (e, t, n) {
							var i = s.apply(this, [e]);
							return n ? (i.then(t, n), Promise.resolve()) : i
						}, t.addIceCandidate = a
					}
				}

				function a(e) {
					var t = e && e.navigator;
					if (t.mediaDevices && t.mediaDevices.getUserMedia) {
						var n = t.mediaDevices,
							i = n.getUserMedia.bind(n);
						t.mediaDevices.getUserMedia = function (e) {
							return i(c(e))
						}
					}!t.getUserMedia && t.mediaDevices && t.mediaDevices.getUserMedia && (t.getUserMedia = function (e, n, i) {
						t.mediaDevices.getUserMedia(e).then(n, i)
					}.bind(t))
				}

				function c(e) {
					return e && e.video !== undefined ? Object.assign({}, e, {
						video: h.compactObject(e.video)
					}) : e
				}

				function l(e) {
					var t = e.RTCPeerConnection;
					e.RTCPeerConnection = function (e, n) {
						if (e && e.iceServers) {
							for (var i = [], r = 0; r < e.iceServers.length; r++) {
								var o = e.iceServers[r];
								!o.hasOwnProperty("urls") && o.hasOwnProperty("url") ? (h.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (o = JSON.parse(JSON.stringify(o))).urls = o.url, delete o.url, i.push(o)) : i.push(e.iceServers[r])
							}
							e.iceServers = i
						}
						return new t(e, n)
					}, e.RTCPeerConnection.prototype = t.prototype, "generateCertificate" in e.RTCPeerConnection && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
						get: function () {
							return t.generateCertificate
						}
					})
				}

				function d(e) {
					"object" === (void 0 === e ? "undefined" : f(e)) && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
						get: function () {
							return {
								receiver: this.receiver
							}
						}
					})
				}

				function u(e) {
					var t = e.RTCPeerConnection.prototype.createOffer;
					e.RTCPeerConnection.prototype.createOffer = function (e) {
						if (e) {
							"undefined" != typeof e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
							var n = this.getTransceivers().find(function (e) {
								return "audio" === e.receiver.track.kind
							});
							!1 === e.offerToReceiveAudio && n ? "sendrecv" === n.direction ? n.setDirection ? n.setDirection("sendonly") : n.direction = "sendonly" : "recvonly" === n.direction && (n.setDirection ? n.setDirection("inactive") : n.direction = "inactive") : !0 !== e.offerToReceiveAudio || n || this.addTransceiver("audio"), "undefined" != typeof e.offerToReceiveVideo && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
							var i = this.getTransceivers().find(function (e) {
								return "video" === e.receiver.track.kind
							});
							!1 === e.offerToReceiveVideo && i ? "sendrecv" === i.direction ? i.setDirection ? i.setDirection("sendonly") : i.direction = "sendonly" : "recvonly" === i.direction && (i.setDirection ? i.setDirection("inactive") : i.direction = "inactive") : !0 !== e.offerToReceiveVideo || i || this.addTransceiver("video")
						}
						return t.apply(this, arguments)
					}
				}

				function p(e) {
					"object" !== (void 0 === e ? "undefined" : f(e)) || e.AudioContext || (e.AudioContext = e.webkitAudioContext)
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				};
				n.shimLocalStreamsAPI = r, n.shimRemoteStreamsAPI = o, n.shimCallbacksAPI = s, n.shimGetUserMedia = a, n.shimConstraints = c, n.shimRTCIceServerUrls = l, n.shimTrackEventTransceiver = d, n.shimCreateOfferLegacy = u, n.shimAudioContext = p;
				var h = i(e("../utils"))
			}, {
				"../utils": 15
			}],
			15: [function (e, t, n) {
				/*
				 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function i(e, t, n) {
					return t in e ? Object.defineProperty(e, t, {
						value: n,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : e[t] = n, e
				}

				function r(e, t, n) {
					var i = e.match(t);
					return i && i.length >= n && parseInt(i[n], 10)
				}

				function o(e, t, n) {
					if (e.RTCPeerConnection) {
						var i = e.RTCPeerConnection.prototype,
							r = i.addEventListener;
						i.addEventListener = function (e, i) {
							if (e !== t) return r.apply(this, arguments);
							var o = function (e) {
								var t = n(e);
								t && i(t)
							};
							return this._eventMap = this._eventMap || {}, this._eventMap[i] = o, r.apply(this, [e, o])
						};
						var o = i.removeEventListener;
						i.removeEventListener = function (e, n) {
							if (e !== t || !this._eventMap || !this._eventMap[n]) return o.apply(this, arguments);
							var i = this._eventMap[n];
							return delete this._eventMap[n], o.apply(this, [e, i])
						}, Object.defineProperty(i, "on" + t, {
							get: function () {
								return this["_on" + t]
							},
							set: function (e) {
								this["_on" + t] && (this.removeEventListener(t, this["_on" + t]), delete this["_on" + t]), e && this.addEventListener(t, this["_on" + t] = e)
							},
							enumerable: !0,
							configurable: !0
						})
					}
				}

				function s(e) {
					return "boolean" != typeof e ? new Error("Argument type: " + (void 0 === e ? "undefined" : m(e)) + ". Please use a boolean.") : (g = e, e ? "adapter.js logging disabled" : "adapter.js logging enabled")
				}

				function a(e) {
					return "boolean" != typeof e ? new Error("Argument type: " + (void 0 === e ? "undefined" : m(e)) + ". Please use a boolean.") : (v = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
				}

				function c() {
					if ("object" === ("undefined" == typeof window ? "undefined" : m(window))) {
						if (g) return;
						"undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
					}
				}

				function l(e, t) {
					v && console.warn(e + " is deprecated, please use " + t + " instead.")
				}

				function d(e) {
					var t = e.navigator,
						n = {
							browser: null,
							version: null
						};
					if (void 0 === e || !e.navigator) return n.browser = "Not a browser.", n;
					if (t.mozGetUserMedia) n.browser = "firefox", n.version = r(t.userAgent, /Firefox\/(\d+)\./, 1);
					else if (t.webkitGetUserMedia || !1 === e.isSecureContext && e.webkitRTCPeerConnection && !e.RTCIceGatherer) n.browser = "chrome", n.version = r(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
					else if (t.mediaDevices && t.userAgent.match(/Edge\/(\d+).(\d+)$/)) n.browser = "edge", n.version = r(t.userAgent, /Edge\/(\d+).(\d+)$/, 2);
					else {
						if (!e.RTCPeerConnection || !t.userAgent.match(/AppleWebKit\/(\d+)\./)) return n.browser = "Not a supported browser.", n;
						n.browser = "safari", n.version = r(t.userAgent, /AppleWebKit\/(\d+)\./, 1), n.supportsUnifiedPlan = e.RTCRtpTransceiver && "currentDirection" in e.RTCRtpTransceiver.prototype
					}
					return n
				}

				function u(e) {
					return "[object Object]" === Object.prototype.toString.call(e)
				}

				function p(e) {
					return u(e) ? Object.keys(e).reduce(function (t, n) {
						var r = u(e[n]),
							o = r ? p(e[n]) : e[n],
							s = r && !Object.keys(o).length;
						return o === undefined || s ? t : Object.assign(t, i({}, n, o))
					}, {}) : e
				}

				function f(e, t, n) {
					t && !n.has(t.id) && (n.set(t.id, t), Object.keys(t).forEach(function (i) {
						i.endsWith("Id") ? f(e, e.get(t[i]), n) : i.endsWith("Ids") && t[i].forEach(function (t) {
							f(e, e.get(t), n)
						})
					}))
				}

				function h(e, t, n) {
					var i = n ? "outbound-rtp" : "inbound-rtp",
						r = new Map;
					if (null === t) return r;
					var o = [];
					return e.forEach(function (e) {
						"track" === e.type && e.trackIdentifier === t.id && o.push(e)
					}), o.forEach(function (t) {
						e.forEach(function (n) {
							n.type === i && n.trackId === t.id && f(e, n, r)
						})
					}), r
				}
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var m = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				};
				n.extractVersion = r, n.wrapPeerConnectionEvent = o, n.disableLog = s, n.disableWarnings = a, n.log = c, n.deprecated = l, n.detectBrowser = d, n.compactObject = p, n.walkStats = f, n.filterStats = h;
				var g = !0,
					v = !0
			}, {}],
			16: [function (e, t) {
				/*
				 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
				 *
				 *  Use of this source code is governed by a BSD-style license
				 *  that can be found in the LICENSE file in the root of the source
				 *  tree.
				 */
				"use strict";

				function n(e) {
					return {
						inboundrtp: "inbound-rtp",
						outboundrtp: "outbound-rtp",
						candidatepair: "candidate-pair",
						localcandidate: "local-candidate",
						remotecandidate: "remote-candidate"
					} [e.type] || e.type
				}

				function i(e, t, n, i, r) {
					var o = l.writeRtpDescription(e.kind, t);
					if (o += l.writeIceParameters(e.iceGatherer.getLocalParameters()), o += l.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : r || "active"), o += "a=mid:" + e.mid + "\r\n", e.rtpSender && e.rtpReceiver ? o += "a=sendrecv\r\n" : e.rtpSender ? o += "a=sendonly\r\n" : e.rtpReceiver ? o += "a=recvonly\r\n" : o += "a=inactive\r\n", e.rtpSender) {
						var s = e.rtpSender._initialTrackId || e.rtpSender.track.id;
						e.rtpSender._initialTrackId = s;
						var a = "msid:" + (i ? i.id : "-") + " " + s + "\r\n";
						o += "a=" + a, o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + a, e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + a, o += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
					}
					return o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + l.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + l.localCName + "\r\n"), o
				}

				function r(e, t) {
					var n = !1;
					return (e = JSON.parse(JSON.stringify(e))).filter(function (e) {
						if (e && (e.urls || e.url)) {
							var i = e.urls || e.url;
							e.url && !e.urls && console.warn("RTCIceServer.url is deprecated! Use urls instead.");
							var r = "string" == typeof i;
							return r && (i = [i]), i = i.filter(function (e) {
								return 0 === e.indexOf("turn:") && -1 !== e.indexOf("transport=udp") && -1 === e.indexOf("turn:[") && !n ? (n = !0, !0) : 0 === e.indexOf("stun:") && t >= 14393 && -1 === e.indexOf("?transport=udp")
							}), delete e.url, e.urls = r ? i[0] : i, !!i.length
						}
					})
				}

				function o(e, t) {
					var n = {
							codecs: [],
							headerExtensions: [],
							fecMechanisms: []
						},
						i = function (e, t) {
							e = parseInt(e, 10);
							for (var n = 0; n < t.length; n++)
								if (t[n].payloadType === e || t[n].preferredPayloadType === e) return t[n]
						},
						r = function (e, t, n, r) {
							var o = i(e.parameters.apt, n),
								s = i(t.parameters.apt, r);
							return o && s && o.name.toLowerCase() === s.name.toLowerCase()
						};
					return e.codecs.forEach(function (i) {
						for (var o = 0; o < t.codecs.length; o++) {
							var s = t.codecs[o];
							if (i.name.toLowerCase() === s.name.toLowerCase() && i.clockRate === s.clockRate) {
								if ("rtx" === i.name.toLowerCase() && i.parameters && s.parameters.apt && !r(i, s, e.codecs, t.codecs)) continue;
								(s = JSON.parse(JSON.stringify(s))).numChannels = Math.min(i.numChannels, s.numChannels), n.codecs.push(s), s.rtcpFeedback = s.rtcpFeedback.filter(function (e) {
									for (var t = 0; t < i.rtcpFeedback.length; t++)
										if (i.rtcpFeedback[t].type === e.type && i.rtcpFeedback[t].parameter === e.parameter) return !0;
									return !1
								});
								break
							}
						}
					}), e.headerExtensions.forEach(function (e) {
						for (var i = 0; i < t.headerExtensions.length; i++) {
							var r = t.headerExtensions[i];
							if (e.uri === r.uri) {
								n.headerExtensions.push(r);
								break
							}
						}
					}), n
				}

				function s(e, t, n) {
					return -1 !== {
						offer: {
							setLocalDescription: ["stable", "have-local-offer"],
							setRemoteDescription: ["stable", "have-remote-offer"]
						},
						answer: {
							setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
							setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
						}
					} [t][e].indexOf(n)
				}

				function a(e, t) {
					var n = e.getRemoteCandidates().find(function (e) {
						return t.foundation === e.foundation && t.ip === e.ip && t.port === e.port && t.priority === e.priority && t.protocol === e.protocol && t.type === e.type
					});
					return n || e.addRemoteCandidate(t), !n
				}

				function c(e, t) {
					var n = new Error(t);
					return n.name = e, n.code = {
						NotSupportedError: 9,
						InvalidStateError: 11,
						InvalidAccessError: 15,
						TypeError: undefined,
						OperationError: undefined
					} [e], n
				}
				var l = e("sdp");
				t.exports = function (e, t) {
					function d(t, n) {
						n.addTrack(t), n.dispatchEvent(new e.MediaStreamTrackEvent("addtrack", {
							track: t
						}))
					}

					function u(t, n) {
						n.removeTrack(t), n.dispatchEvent(new e.MediaStreamTrackEvent("removetrack", {
							track: t
						}))
					}

					function p(t, n, i, r) {
						var o = new Event("track");
						o.track = n, o.receiver = i, o.transceiver = {
							receiver: i
						}, o.streams = r, e.setTimeout(function () {
							t._dispatchEvent("track", o)
						})
					}
					var f = function (n) {
						var i = this,
							o = document.createDocumentFragment();
						if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function (e) {
								i[e] = o[e].bind(o)
							}), this.canTrickleIceCandidates = null, this.needNegotiation = !1, this.localStreams = [], this.remoteStreams = [], this._localDescription = null, this._remoteDescription = null, this.signalingState = "stable", this.iceConnectionState = "new", this.connectionState = "new", this.iceGatheringState = "new", n = JSON.parse(JSON.stringify(n || {})), this.usingBundle = "max-bundle" === n.bundlePolicy, "negotiate" === n.rtcpMuxPolicy) throw c("NotSupportedError", "rtcpMuxPolicy 'negotiate' is not supported");
						switch (n.rtcpMuxPolicy || (n.rtcpMuxPolicy = "require"), n.iceTransportPolicy) {
							case "all":
							case "relay":
								break;
							default:
								n.iceTransportPolicy = "all"
						}
						switch (n.bundlePolicy) {
							case "balanced":
							case "max-compat":
							case "max-bundle":
								break;
							default:
								n.bundlePolicy = "balanced"
						}
						if (n.iceServers = r(n.iceServers || [], t), this._iceGatherers = [], n.iceCandidatePoolSize)
							for (var s = n.iceCandidatePoolSize; s > 0; s--) this._iceGatherers.push(new e.RTCIceGatherer({
								iceServers: n.iceServers,
								gatherPolicy: n.iceTransportPolicy
							}));
						else n.iceCandidatePoolSize = 0;
						this._config = n, this.transceivers = [], this._sdpSessionId = l.generateSessionId(), this._sdpSessionVersion = 0, this._dtlsRole = undefined, this._isClosed = !1
					};
					Object.defineProperty(f.prototype, "localDescription", {
						configurable: !0,
						get: function () {
							return this._localDescription
						}
					}), Object.defineProperty(f.prototype, "remoteDescription", {
						configurable: !0,
						get: function () {
							return this._remoteDescription
						}
					}), f.prototype.onicecandidate = null, f.prototype.onaddstream = null, f.prototype.ontrack = null, f.prototype.onremovestream = null, f.prototype.onsignalingstatechange = null, f.prototype.oniceconnectionstatechange = null, f.prototype.onconnectionstatechange = null, f.prototype.onicegatheringstatechange = null, f.prototype.onnegotiationneeded = null, f.prototype.ondatachannel = null, f.prototype._dispatchEvent = function (e, t) {
						this._isClosed || (this.dispatchEvent(t), "function" == typeof this["on" + e] && this["on" + e](t))
					}, f.prototype._emitGatheringStateChange = function () {
						var e = new Event("icegatheringstatechange");
						this._dispatchEvent("icegatheringstatechange", e)
					}, f.prototype.getConfiguration = function () {
						return this._config
					}, f.prototype.getLocalStreams = function () {
						return this.localStreams
					}, f.prototype.getRemoteStreams = function () {
						return this.remoteStreams
					}, f.prototype._createTransceiver = function (e, t) {
						var n = this.transceivers.length > 0,
							i = {
								track: null,
								iceGatherer: null,
								iceTransport: null,
								dtlsTransport: null,
								localCapabilities: null,
								remoteCapabilities: null,
								rtpSender: null,
								rtpReceiver: null,
								kind: e,
								mid: null,
								sendEncodingParameters: null,
								recvEncodingParameters: null,
								stream: null,
								associatedRemoteMediaStreams: [],
								wantReceive: !0
							};
						if (this.usingBundle && n) i.iceTransport = this.transceivers[0].iceTransport, i.dtlsTransport = this.transceivers[0].dtlsTransport;
						else {
							var r = this._createIceAndDtlsTransports();
							i.iceTransport = r.iceTransport, i.dtlsTransport = r.dtlsTransport
						}
						return t || this.transceivers.push(i), i
					}, f.prototype.addTrack = function (t, n) {
						if (this._isClosed) throw c("InvalidStateError", "Attempted to call addTrack on a closed peerconnection.");
						var i;
						if (this.transceivers.find(function (e) {
								return e.track === t
							})) throw c("InvalidAccessError", "Track already exists.");
						for (var r = 0; r < this.transceivers.length; r++) this.transceivers[r].track || this.transceivers[r].kind !== t.kind || (i = this.transceivers[r]);
						return i || (i = this._createTransceiver(t.kind)), this._maybeFireNegotiationNeeded(), -1 === this.localStreams.indexOf(n) && this.localStreams.push(n), i.track = t, i.stream = n, i.rtpSender = new e.RTCRtpSender(t, i.dtlsTransport), i.rtpSender
					}, f.prototype.addStream = function (e) {
						var n = this;
						if (t >= 15025) e.getTracks().forEach(function (t) {
							n.addTrack(t, e)
						});
						else {
							var i = e.clone();
							e.getTracks().forEach(function (e, t) {
								var n = i.getTracks()[t];
								e.addEventListener("enabled", function (e) {
									n.enabled = e.enabled
								})
							}), i.getTracks().forEach(function (e) {
								n.addTrack(e, i)
							})
						}
					}, f.prototype.removeTrack = function (t) {
						if (this._isClosed) throw c("InvalidStateError", "Attempted to call removeTrack on a closed peerconnection.");
						if (!(t instanceof e.RTCRtpSender)) throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");
						var n = this.transceivers.find(function (e) {
							return e.rtpSender === t
						});
						if (!n) throw c("InvalidAccessError", "Sender was not created by this connection.");
						var i = n.stream;
						n.rtpSender.stop(), n.rtpSender = null, n.track = null, n.stream = null, -1 === this.transceivers.map(function (e) {
							return e.stream
						}).indexOf(i) && this.localStreams.indexOf(i) > -1 && this.localStreams.splice(this.localStreams.indexOf(i), 1), this._maybeFireNegotiationNeeded()
					}, f.prototype.removeStream = function (e) {
						var t = this;
						e.getTracks().forEach(function (e) {
							var n = t.getSenders().find(function (t) {
								return t.track === e
							});
							n && t.removeTrack(n)
						})
					}, f.prototype.getSenders = function () {
						return this.transceivers.filter(function (e) {
							return !!e.rtpSender
						}).map(function (e) {
							return e.rtpSender
						})
					}, f.prototype.getReceivers = function () {
						return this.transceivers.filter(function (e) {
							return !!e.rtpReceiver
						}).map(function (e) {
							return e.rtpReceiver
						})
					}, f.prototype._createIceGatherer = function (t, n) {
						var i = this;
						if (n && t > 0) return this.transceivers[0].iceGatherer;
						if (this._iceGatherers.length) return this._iceGatherers.shift();
						var r = new e.RTCIceGatherer({
							iceServers: this._config.iceServers,
							gatherPolicy: this._config.iceTransportPolicy
						});
						return Object.defineProperty(r, "state", {
							value: "new",
							writable: !0
						}), this.transceivers[t].bufferedCandidateEvents = [], this.transceivers[t].bufferCandidates = function (e) {
							var n = !e.candidate || 0 === Object.keys(e.candidate).length;
							r.state = n ? "completed" : "gathering", null !== i.transceivers[t].bufferedCandidateEvents && i.transceivers[t].bufferedCandidateEvents.push(e)
						}, r.addEventListener("localcandidate", this.transceivers[t].bufferCandidates), r
					}, f.prototype._gather = function (t, n) {
						var i = this,
							r = this.transceivers[n].iceGatherer;
						if (!r.onlocalcandidate) {
							var o = this.transceivers[n].bufferedCandidateEvents;
							this.transceivers[n].bufferedCandidateEvents = null, r.removeEventListener("localcandidate", this.transceivers[n].bufferCandidates), r.onlocalcandidate = function (e) {
								if (!(i.usingBundle && n > 0)) {
									var o = new Event("icecandidate");
									o.candidate = {
										sdpMid: t,
										sdpMLineIndex: n
									};
									var s = e.candidate,
										a = !s || 0 === Object.keys(s).length;
									if (a) "new" !== r.state && "gathering" !== r.state || (r.state = "completed");
									else {
										"new" === r.state && (r.state = "gathering"), s.component = 1, s.ufrag = r.getLocalParameters().usernameFragment;
										var c = l.writeCandidate(s);
										o.candidate = Object.assign(o.candidate, l.parseCandidate(c)), o.candidate.candidate = c, o.candidate.toJSON = function () {
											return {
												candidate: o.candidate.candidate,
												sdpMid: o.candidate.sdpMid,
												sdpMLineIndex: o.candidate.sdpMLineIndex,
												usernameFragment: o.candidate.usernameFragment
											}
										}
									}
									var d = l.getMediaSections(i._localDescription.sdp);
									d[o.candidate.sdpMLineIndex] += a ? "a=end-of-candidates\r\n" : "a=" + o.candidate.candidate + "\r\n", i._localDescription.sdp = l.getDescription(i._localDescription.sdp) + d.join("");
									var u = i.transceivers.every(function (e) {
										return e.iceGatherer && "completed" === e.iceGatherer.state
									});
									"gathering" !== i.iceGatheringState && (i.iceGatheringState = "gathering", i._emitGatheringStateChange()), a || i._dispatchEvent("icecandidate", o), u && (i._dispatchEvent("icecandidate", new Event("icecandidate")), i.iceGatheringState = "complete", i._emitGatheringStateChange())
								}
							}, e.setTimeout(function () {
								o.forEach(function (e) {
									r.onlocalcandidate(e)
								})
							}, 0)
						}
					}, f.prototype._createIceAndDtlsTransports = function () {
						var t = this,
							n = new e.RTCIceTransport(null);
						n.onicestatechange = function () {
							t._updateIceConnectionState(), t._updateConnectionState()
						};
						var i = new e.RTCDtlsTransport(n);
						return i.ondtlsstatechange = function () {
							t._updateConnectionState()
						}, i.onerror = function () {
							Object.defineProperty(i, "state", {
								value: "failed",
								writable: !0
							}), t._updateConnectionState()
						}, {
							iceTransport: n,
							dtlsTransport: i
						}
					}, f.prototype._disposeIceAndDtlsTransports = function (e) {
						var t = this.transceivers[e].iceGatherer;
						t && (delete t.onlocalcandidate, delete this.transceivers[e].iceGatherer);
						var n = this.transceivers[e].iceTransport;
						n && (delete n.onicestatechange, delete this.transceivers[e].iceTransport);
						var i = this.transceivers[e].dtlsTransport;
						i && (delete i.ondtlsstatechange, delete i.onerror, delete this.transceivers[e].dtlsTransport)
					}, f.prototype._transceive = function (e, n, i) {
						var r = o(e.localCapabilities, e.remoteCapabilities);
						n && e.rtpSender && (r.encodings = e.sendEncodingParameters, r.rtcp = {
							cname: l.localCName,
							compound: e.rtcpParameters.compound
						}, e.recvEncodingParameters.length && (r.rtcp.ssrc = e.recvEncodingParameters[0].ssrc), e.rtpSender.send(r)), i && e.rtpReceiver && r.codecs.length > 0 && ("video" === e.kind && e.recvEncodingParameters && t < 15019 && e.recvEncodingParameters.forEach(function (e) {
							delete e.rtx
						}), e.recvEncodingParameters.length ? r.encodings = e.recvEncodingParameters : r.encodings = [{}], r.rtcp = {
							compound: e.rtcpParameters.compound
						}, e.rtcpParameters.cname && (r.rtcp.cname = e.rtcpParameters.cname), e.sendEncodingParameters.length && (r.rtcp.ssrc = e.sendEncodingParameters[0].ssrc), e.rtpReceiver.receive(r))
					}, f.prototype.setLocalDescription = function (e) {
						var t, n, i = this;
						if (-1 === ["offer", "answer"].indexOf(e.type)) return Promise.reject(c("TypeError", 'Unsupported type "' + e.type + '"'));
						if (!s("setLocalDescription", e.type, i.signalingState) || i._isClosed) return Promise.reject(c("InvalidStateError", "Can not set local " + e.type + " in state " + i.signalingState));
						if ("offer" === e.type) t = l.splitSections(e.sdp), n = t.shift(), t.forEach(function (e, t) {
							var n = l.parseRtpParameters(e);
							i.transceivers[t].localCapabilities = n
						}), i.transceivers.forEach(function (e, t) {
							i._gather(e.mid, t)
						});
						else if ("answer" === e.type) {
							t = l.splitSections(i._remoteDescription.sdp), n = t.shift();
							var r = l.matchPrefix(n, "a=ice-lite").length > 0;
							t.forEach(function (e, t) {
								var s = i.transceivers[t],
									a = s.iceGatherer,
									c = s.iceTransport,
									d = s.dtlsTransport,
									u = s.localCapabilities,
									p = s.remoteCapabilities;
								if (!(l.isRejected(e) && 0 === l.matchPrefix(e, "a=bundle-only").length) && !s.rejected) {
									var f = l.getIceParameters(e, n),
										h = l.getDtlsParameters(e, n);
									r && (h.role = "server"), i.usingBundle && 0 !== t || (i._gather(s.mid, t), "new" === c.state && c.start(a, f, r ? "controlling" : "controlled"), "new" === d.state && d.start(h));
									var m = o(u, p);
									i._transceive(s, m.codecs.length > 0, !1)
								}
							})
						}
						return i._localDescription = {
							type: e.type,
							sdp: e.sdp
						}, "offer" === e.type ? i._updateSignalingState("have-local-offer") : i._updateSignalingState("stable"), Promise.resolve()
					}, f.prototype.setRemoteDescription = function (n) {
						var i = this;
						if (-1 === ["offer", "answer"].indexOf(n.type)) return Promise.reject(c("TypeError", 'Unsupported type "' + n.type + '"'));
						if (!s("setRemoteDescription", n.type, i.signalingState) || i._isClosed) return Promise.reject(c("InvalidStateError", "Can not set remote " + n.type + " in state " + i.signalingState));
						var r = {};
						i.remoteStreams.forEach(function (e) {
							r[e.id] = e
						});
						var f = [],
							h = l.splitSections(n.sdp),
							m = h.shift(),
							g = l.matchPrefix(m, "a=ice-lite").length > 0,
							v = l.matchPrefix(m, "a=group:BUNDLE ").length > 0;
						i.usingBundle = v;
						var y = l.matchPrefix(m, "a=ice-options:")[0];
						return i.canTrickleIceCandidates = !!y && y.substr(14).split(" ").indexOf("trickle") >= 0, h.forEach(function (s, c) {
							var p = l.splitLines(s),
								h = l.getKind(s),
								y = l.isRejected(s) && 0 === l.matchPrefix(s, "a=bundle-only").length,
								A = p[0].substr(2).split(" ")[2],
								b = l.getDirection(s, m),
								w = l.parseMsid(s),
								S = l.getMid(s) || l.generateIdentifier();
							if (y || "application" === h && ("DTLS/SCTP" === A || "UDP/DTLS/SCTP" === A)) i.transceivers[c] = {
								mid: S,
								kind: h,
								protocol: A,
								rejected: !0
							};
							else {
								var C, T, x, k, _, E, P, D, $;
								!y && i.transceivers[c] && i.transceivers[c].rejected && (i.transceivers[c] = i._createTransceiver(h, !0));
								var R, I, O = l.parseRtpParameters(s);
								y || (R = l.getIceParameters(s, m), (I = l.getDtlsParameters(s, m)).role = "client"), P = l.parseRtpEncodingParameters(s);
								var L = l.parseRtcpParameters(s),
									M = l.matchPrefix(s, "a=end-of-candidates", m).length > 0,
									j = l.matchPrefix(s, "a=candidate:").map(function (e) {
										return l.parseCandidate(e)
									}).filter(function (e) {
										return 1 === e.component
									});
								if (("offer" === n.type || "answer" === n.type) && !y && v && c > 0 && i.transceivers[c] && (i._disposeIceAndDtlsTransports(c), i.transceivers[c].iceGatherer = i.transceivers[0].iceGatherer, i.transceivers[c].iceTransport = i.transceivers[0].iceTransport, i.transceivers[c].dtlsTransport = i.transceivers[0].dtlsTransport, i.transceivers[c].rtpSender && i.transceivers[c].rtpSender.setTransport(i.transceivers[0].dtlsTransport), i.transceivers[c].rtpReceiver && i.transceivers[c].rtpReceiver.setTransport(i.transceivers[0].dtlsTransport)), "offer" !== n.type || y) {
									if ("answer" === n.type && !y) {
										T = (C = i.transceivers[c]).iceGatherer, x = C.iceTransport, k = C.dtlsTransport, _ = C.rtpReceiver, E = C.sendEncodingParameters, D = C.localCapabilities, i.transceivers[c].recvEncodingParameters = P, i.transceivers[c].remoteCapabilities = O, i.transceivers[c].rtcpParameters = L, j.length && "new" === x.state && (!g && !M || v && 0 !== c ? j.forEach(function (e) {
											a(C.iceTransport, e)
										}) : x.setRemoteCandidates(j)), v && 0 !== c || ("new" === x.state && x.start(T, R, "controlling"), "new" === k.state && k.start(I)), !o(C.localCapabilities, C.remoteCapabilities).codecs.filter(function (e) {
											return "rtx" === e.name.toLowerCase()
										}).length && C.sendEncodingParameters[0].rtx && delete C.sendEncodingParameters[0].rtx, i._transceive(C, "sendrecv" === b || "recvonly" === b, "sendrecv" === b || "sendonly" === b), !_ || "sendrecv" !== b && "sendonly" !== b ? delete C.rtpReceiver : ($ = _.track, w ? (r[w.stream] || (r[w.stream] = new e.MediaStream), d($, r[w.stream]), f.push([$, _, r[w.stream]])) : (r["default"] || (r["default"] = new e.MediaStream), d($, r["default"]), f.push([$, _, r["default"]])))
									}
								} else {
									(C = i.transceivers[c] || i._createTransceiver(h)).mid = S, C.iceGatherer || (C.iceGatherer = i._createIceGatherer(c, v)), j.length && "new" === C.iceTransport.state && (!M || v && 0 !== c ? j.forEach(function (e) {
										a(C.iceTransport, e)
									}) : C.iceTransport.setRemoteCandidates(j)), D = e.RTCRtpReceiver.getCapabilities(h), t < 15019 && (D.codecs = D.codecs.filter(function (e) {
										return "rtx" !== e.name
									})), E = C.sendEncodingParameters || [{
										ssrc: 1001 * (2 * c + 2)
									}];
									var N, J = !1;
									if ("sendrecv" === b || "sendonly" === b) {
										if (J = !C.rtpReceiver, _ = C.rtpReceiver || new e.RTCRtpReceiver(C.dtlsTransport, h), J) $ = _.track, w && "-" === w.stream || (w ? (r[w.stream] || (r[w.stream] = new e.MediaStream, Object.defineProperty(r[w.stream], "id", {
											get: function () {
												return w.stream
											}
										})), Object.defineProperty($, "id", {
											get: function () {
												return w.track
											}
										}), N = r[w.stream]) : (r["default"] || (r["default"] = new e.MediaStream), N = r["default"])), N && (d($, N), C.associatedRemoteMediaStreams.push(N)), f.push([$, _, N])
									} else C.rtpReceiver && C.rtpReceiver.track && (C.associatedRemoteMediaStreams.forEach(function (e) {
										var t = e.getTracks().find(function (e) {
											return e.id === C.rtpReceiver.track.id
										});
										t && u(t, e)
									}), C.associatedRemoteMediaStreams = []);
									C.localCapabilities = D, C.remoteCapabilities = O, C.rtpReceiver = _, C.rtcpParameters = L, C.sendEncodingParameters = E, C.recvEncodingParameters = P, i._transceive(i.transceivers[c], !1, J)
								}
							}
						}), i._dtlsRole === undefined && (i._dtlsRole = "offer" === n.type ? "active" : "passive"), i._remoteDescription = {
							type: n.type,
							sdp: n.sdp
						}, "offer" === n.type ? i._updateSignalingState("have-remote-offer") : i._updateSignalingState("stable"), Object.keys(r).forEach(function (t) {
							var n = r[t];
							if (n.getTracks().length) {
								if (-1 === i.remoteStreams.indexOf(n)) {
									i.remoteStreams.push(n);
									var o = new Event("addstream");
									o.stream = n, e.setTimeout(function () {
										i._dispatchEvent("addstream", o)
									})
								}
								f.forEach(function (e) {
									var t = e[0],
										r = e[1];
									n.id === e[2].id && p(i, t, r, [n])
								})
							}
						}), f.forEach(function (e) {
							e[2] || p(i, e[0], e[1], [])
						}), e.setTimeout(function () {
							i && i.transceivers && i.transceivers.forEach(function (e) {
								e.iceTransport && "new" === e.iceTransport.state && e.iceTransport.getRemoteCandidates().length > 0 && (console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"), e.iceTransport.addRemoteCandidate({}))
							})
						}, 4e3), Promise.resolve()
					}, f.prototype.close = function () {
						this.transceivers.forEach(function (e) {
							e.iceTransport && e.iceTransport.stop(), e.dtlsTransport && e.dtlsTransport.stop(), e.rtpSender && e.rtpSender.stop(), e.rtpReceiver && e.rtpReceiver.stop()
						}), this._isClosed = !0, this._updateSignalingState("closed")
					}, f.prototype._updateSignalingState = function (e) {
						this.signalingState = e;
						var t = new Event("signalingstatechange");
						this._dispatchEvent("signalingstatechange", t)
					}, f.prototype._maybeFireNegotiationNeeded = function () {
						var t = this;
						"stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0, e.setTimeout(function () {
							if (t.needNegotiation) {
								t.needNegotiation = !1;
								var e = new Event("negotiationneeded");
								t._dispatchEvent("negotiationneeded", e)
							}
						}, 0))
					}, f.prototype._updateIceConnectionState = function () {
						var e, t = {
							"new": 0,
							closed: 0,
							checking: 0,
							connected: 0,
							completed: 0,
							disconnected: 0,
							failed: 0
						};
						if (this.transceivers.forEach(function (e) {
								e.iceTransport && !e.rejected && t[e.iceTransport.state]++
							}), e = "new", t.failed > 0 ? e = "failed" : t.checking > 0 ? e = "checking" : t.disconnected > 0 ? e = "disconnected" : t["new"] > 0 ? e = "new" : t.connected > 0 ? e = "connected" : t.completed > 0 && (e = "completed"), e !== this.iceConnectionState) {
							this.iceConnectionState = e;
							var n = new Event("iceconnectionstatechange");
							this._dispatchEvent("iceconnectionstatechange", n)
						}
					}, f.prototype._updateConnectionState = function () {
						var e, t = {
							"new": 0,
							closed: 0,
							connecting: 0,
							connected: 0,
							completed: 0,
							disconnected: 0,
							failed: 0
						};
						if (this.transceivers.forEach(function (e) {
								e.iceTransport && e.dtlsTransport && !e.rejected && (t[e.iceTransport.state]++, t[e.dtlsTransport.state]++)
							}), t.connected += t.completed, e = "new", t.failed > 0 ? e = "failed" : t.connecting > 0 ? e = "connecting" : t.disconnected > 0 ? e = "disconnected" : t["new"] > 0 ? e = "new" : t.connected > 0 && (e = "connected"), e !== this.connectionState) {
							this.connectionState = e;
							var n = new Event("connectionstatechange");
							this._dispatchEvent("connectionstatechange", n)
						}
					}, f.prototype.createOffer = function () {
						var n = this;
						if (n._isClosed) return Promise.reject(c("InvalidStateError", "Can not call createOffer after close"));
						var r = n.transceivers.filter(function (e) {
								return "audio" === e.kind
							}).length,
							o = n.transceivers.filter(function (e) {
								return "video" === e.kind
							}).length,
							s = arguments[0];
						if (s) {
							if (s.mandatory || s.optional) throw new TypeError("Legacy mandatory/optional constraints not supported.");
							s.offerToReceiveAudio !== undefined && (r = !0 === s.offerToReceiveAudio ? 1 : !1 === s.offerToReceiveAudio ? 0 : s.offerToReceiveAudio), s.offerToReceiveVideo !== undefined && (o = !0 === s.offerToReceiveVideo ? 1 : !1 === s.offerToReceiveVideo ? 0 : s.offerToReceiveVideo)
						}
						for (n.transceivers.forEach(function (e) {
								"audio" === e.kind ? --r < 0 && (e.wantReceive = !1) : "video" === e.kind && --o < 0 && (e.wantReceive = !1)
							}); r > 0 || o > 0;) r > 0 && (n._createTransceiver("audio"), r--), o > 0 && (n._createTransceiver("video"), o--);
						var a = l.writeSessionBoilerplate(n._sdpSessionId, n._sdpSessionVersion++);
						n.transceivers.forEach(function (i, r) {
							var o = i.track,
								s = i.kind,
								a = i.mid || l.generateIdentifier();
							i.mid = a, i.iceGatherer || (i.iceGatherer = n._createIceGatherer(r, n.usingBundle));
							var c = e.RTCRtpSender.getCapabilities(s);
							t < 15019 && (c.codecs = c.codecs.filter(function (e) {
								return "rtx" !== e.name
							})), c.codecs.forEach(function (e) {
								"H264" === e.name && e.parameters["level-asymmetry-allowed"] === undefined && (e.parameters["level-asymmetry-allowed"] = "1"), i.remoteCapabilities && i.remoteCapabilities.codecs && i.remoteCapabilities.codecs.forEach(function (t) {
									e.name.toLowerCase() === t.name.toLowerCase() && e.clockRate === t.clockRate && (e.preferredPayloadType = t.payloadType)
								})
							}), c.headerExtensions.forEach(function (e) {
								(i.remoteCapabilities && i.remoteCapabilities.headerExtensions || []).forEach(function (t) {
									e.uri === t.uri && (e.id = t.id)
								})
							});
							var d = i.sendEncodingParameters || [{
								ssrc: 1001 * (2 * r + 1)
							}];
							o && t >= 15019 && "video" === s && !d[0].rtx && (d[0].rtx = {
								ssrc: d[0].ssrc + 1
							}), i.wantReceive && (i.rtpReceiver = new e.RTCRtpReceiver(i.dtlsTransport, s)), i.localCapabilities = c, i.sendEncodingParameters = d
						}), "max-compat" !== n._config.bundlePolicy && (a += "a=group:BUNDLE " + n.transceivers.map(function (e) {
							return e.mid
						}).join(" ") + "\r\n"), a += "a=ice-options:trickle\r\n", n.transceivers.forEach(function (e, t) {
							a += i(e, e.localCapabilities, "offer", e.stream, n._dtlsRole), a += "a=rtcp-rsize\r\n", !e.iceGatherer || "new" === n.iceGatheringState || 0 !== t && n.usingBundle || (e.iceGatherer.getLocalCandidates().forEach(function (e) {
								e.component = 1, a += "a=" + l.writeCandidate(e) + "\r\n"
							}), "completed" === e.iceGatherer.state && (a += "a=end-of-candidates\r\n"))
						});
						var d = new e.RTCSessionDescription({
							type: "offer",
							sdp: a
						});
						return Promise.resolve(d)
					}, f.prototype.createAnswer = function () {
						var n = this;
						if (n._isClosed) return Promise.reject(c("InvalidStateError", "Can not call createAnswer after close"));
						if ("have-remote-offer" !== n.signalingState && "have-local-pranswer" !== n.signalingState) return Promise.reject(c("InvalidStateError", "Can not call createAnswer in signalingState " + n.signalingState));
						var r = l.writeSessionBoilerplate(n._sdpSessionId, n._sdpSessionVersion++);
						n.usingBundle && (r += "a=group:BUNDLE " + n.transceivers.map(function (e) {
							return e.mid
						}).join(" ") + "\r\n"), r += "a=ice-options:trickle\r\n";
						var s = l.getMediaSections(n._remoteDescription.sdp).length;
						n.transceivers.forEach(function (e, a) {
							if (!(a + 1 > s)) {
								if (e.rejected) return "application" === e.kind ? "DTLS/SCTP" === e.protocol ? r += "m=application 0 DTLS/SCTP 5000\r\n" : r += "m=application 0 " + e.protocol + " webrtc-datachannel\r\n" : "audio" === e.kind ? r += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n" : "video" === e.kind && (r += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n"), void(r += "c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:" + e.mid + "\r\n");
								var c;
								if (e.stream) "audio" === e.kind ? c = e.stream.getAudioTracks()[0] : "video" === e.kind && (c = e.stream.getVideoTracks()[0]), c && t >= 15019 && "video" === e.kind && !e.sendEncodingParameters[0].rtx && (e.sendEncodingParameters[0].rtx = {
									ssrc: e.sendEncodingParameters[0].ssrc + 1
								});
								var l = o(e.localCapabilities, e.remoteCapabilities);
								!l.codecs.filter(function (e) {
									return "rtx" === e.name.toLowerCase()
								}).length && e.sendEncodingParameters[0].rtx && delete e.sendEncodingParameters[0].rtx, r += i(e, l, "answer", e.stream, n._dtlsRole), e.rtcpParameters && e.rtcpParameters.reducedSize && (r += "a=rtcp-rsize\r\n")
							}
						});
						var a = new e.RTCSessionDescription({
							type: "answer",
							sdp: r
						});
						return Promise.resolve(a)
					}, f.prototype.addIceCandidate = function (e) {
						var t, n = this;
						return e && e.sdpMLineIndex === undefined && !e.sdpMid ? Promise.reject(new TypeError("sdpMLineIndex or sdpMid required")) : new Promise(function (i, r) {
							if (!n._remoteDescription) return r(c("InvalidStateError", "Can not add ICE candidate without a remote description"));
							if (e && "" !== e.candidate) {
								var o = e.sdpMLineIndex;
								if (e.sdpMid)
									for (var s = 0; s < n.transceivers.length; s++)
										if (n.transceivers[s].mid === e.sdpMid) {
											o = s;
											break
										} var d = n.transceivers[o];
								if (!d) return r(c("OperationError", "Can not add ICE candidate"));
								if (d.rejected) return i();
								var u = Object.keys(e.candidate).length > 0 ? l.parseCandidate(e.candidate) : {};
								if ("tcp" === u.protocol && (0 === u.port || 9 === u.port)) return i();
								if (u.component && 1 !== u.component) return i();
								if ((0 === o || o > 0 && d.iceTransport !== n.transceivers[0].iceTransport) && !a(d.iceTransport, u)) return r(c("OperationError", "Can not add ICE candidate"));
								var p = e.candidate.trim();
								0 === p.indexOf("a=") && (p = p.substr(2)), (t = l.getMediaSections(n._remoteDescription.sdp))[o] += "a=" + (u.type ? p : "end-of-candidates") + "\r\n", n._remoteDescription.sdp = l.getDescription(n._remoteDescription.sdp) + t.join("")
							} else
								for (var f = 0; f < n.transceivers.length && (n.transceivers[f].rejected || (n.transceivers[f].iceTransport.addRemoteCandidate({}), (t = l.getMediaSections(n._remoteDescription.sdp))[f] += "a=end-of-candidates\r\n", n._remoteDescription.sdp = l.getDescription(n._remoteDescription.sdp) + t.join(""), !n.usingBundle)); f++);
							i()
						})
					}, f.prototype.getStats = function (t) {
						if (t && t instanceof e.MediaStreamTrack) {
							var n = null;
							if (this.transceivers.forEach(function (e) {
									e.rtpSender && e.rtpSender.track === t ? n = e.rtpSender : e.rtpReceiver && e.rtpReceiver.track === t && (n = e.rtpReceiver)
								}), !n) throw c("InvalidAccessError", "Invalid selector.");
							return n.getStats()
						}
						var i = [];
						return this.transceivers.forEach(function (e) {
							["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function (t) {
								e[t] && i.push(e[t].getStats())
							})
						}), Promise.all(i).then(function (e) {
							var t = new Map;
							return e.forEach(function (e) {
								e.forEach(function (e) {
									t.set(e.id, e)
								})
							}), t
						})
					}, ["RTCRtpSender", "RTCRtpReceiver", "RTCIceGatherer", "RTCIceTransport", "RTCDtlsTransport"].forEach(function (t) {
						var i = e[t];
						if (i && i.prototype && i.prototype.getStats) {
							var r = i.prototype.getStats;
							i.prototype.getStats = function () {
								return r.apply(this).then(function (e) {
									var t = new Map;
									return Object.keys(e).forEach(function (i) {
										e[i].type = n(e[i]), t.set(i, e[i])
									}), t
								})
							}
						}
					});
					var h = ["createOffer", "createAnswer"];
					return h.forEach(function (e) {
						var t = f.prototype[e];
						f.prototype[e] = function () {
							var e = arguments;
							return "function" == typeof e[0] || "function" == typeof e[1] ? t.apply(this, [arguments[2]]).then(function (t) {
								"function" == typeof e[0] && e[0].apply(null, [t])
							}, function (t) {
								"function" == typeof e[1] && e[1].apply(null, [t])
							}) : t.apply(this, arguments)
						}
					}), (h = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"]).forEach(function (e) {
						var t = f.prototype[e];
						f.prototype[e] = function () {
							var e = arguments;
							return "function" == typeof e[1] || "function" == typeof e[2] ? t.apply(this, arguments).then(function () {
								"function" == typeof e[1] && e[1].apply(null)
							}, function (t) {
								"function" == typeof e[2] && e[2].apply(null, [t])
							}) : t.apply(this, arguments)
						}
					}), ["getStats"].forEach(function (e) {
						var t = f.prototype[e];
						f.prototype[e] = function () {
							var e = arguments;
							return "function" == typeof e[1] ? t.apply(this, arguments).then(function () {
								"function" == typeof e[1] && e[1].apply(null)
							}) : t.apply(this, arguments)
						}
					}), f
				}
			}, {
				sdp: 17
			}],
			17: [function (e, t) {
				"use strict";
				var n = {
					generateIdentifier: function () {
						return Math.random().toString(36).substr(2, 10)
					}
				};
				n.localCName = n.generateIdentifier(), n.splitLines = function (e) {
						return e.trim().split("\n").map(function (e) {
							return e.trim()
						})
					}, n.splitSections = function (e) {
						return e.split("\nm=").map(function (e, t) {
							return (t > 0 ? "m=" + e : e).trim() + "\r\n"
						})
					}, n.getDescription = function (e) {
						var t = n.splitSections(e);
						return t && t[0]
					}, n.getMediaSections = function (e) {
						var t = n.splitSections(e);
						return t.shift(), t
					}, n.matchPrefix = function (e, t) {
						return n.splitLines(e).filter(function (e) {
							return 0 === e.indexOf(t)
						})
					}, n.parseCandidate = function (e) {
						for (var t, n = {
								foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
								component: parseInt(t[1], 10),
								protocol: t[2].toLowerCase(),
								priority: parseInt(t[3], 10),
								ip: t[4],
								address: t[4],
								port: parseInt(t[5], 10),
								type: t[7]
							}, i = 8; i < t.length; i += 2) switch (t[i]) {
							case "raddr":
								n.relatedAddress = t[i + 1];
								break;
							case "rport":
								n.relatedPort = parseInt(t[i + 1], 10);
								break;
							case "tcptype":
								n.tcpType = t[i + 1];
								break;
							case "ufrag":
								n.ufrag = t[i + 1], n.usernameFragment = t[i + 1];
								break;
							default:
								n[t[i]] = t[i + 1]
						}
						return n
					}, n.writeCandidate = function (e) {
						var t = [];
						t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.address || e.ip), t.push(e.port);
						var n = e.type;
						return t.push("typ"), t.push(n), "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ")
					}, n.parseIceOptions = function (e) {
						return e.substr(14).split(" ")
					}, n.parseRtpMap = function (e) {
						var t = e.substr(9).split(" "),
							n = {
								payloadType: parseInt(t.shift(), 10)
							};
						return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.channels = 3 === t.length ? parseInt(t[2], 10) : 1, n.numChannels = n.channels, n
					}, n.writeRtpMap = function (e) {
						var t = e.payloadType;
						e.preferredPayloadType !== undefined && (t = e.preferredPayloadType);
						var n = e.channels || e.numChannels || 1;
						return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== n ? "/" + n : "") + "\r\n"
					}, n.parseExtmap = function (e) {
						var t = e.substr(9).split(" ");
						return {
							id: parseInt(t[0], 10),
							direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
							uri: t[1]
						}
					}, n.writeExtmap = function (e) {
						return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n"
					}, n.parseFmtp = function (e) {
						for (var t, n = {}, i = e.substr(e.indexOf(" ") + 1).split(";"), r = 0; r < i.length; r++) n[(t = i[r].trim().split("="))[0].trim()] = t[1];
						return n
					}, n.writeFmtp = function (e) {
						var t = "",
							n = e.payloadType;
						if (e.preferredPayloadType !== undefined && (n = e.preferredPayloadType), e.parameters && Object.keys(e.parameters).length) {
							var i = [];
							Object.keys(e.parameters).forEach(function (t) {
								e.parameters[t] ? i.push(t + "=" + e.parameters[t]) : i.push(t)
							}), t += "a=fmtp:" + n + " " + i.join(";") + "\r\n"
						}
						return t
					}, n.parseRtcpFb = function (e) {
						var t = e.substr(e.indexOf(" ") + 1).split(" ");
						return {
							type: t.shift(),
							parameter: t.join(" ")
						}
					}, n.writeRtcpFb = function (e) {
						var t = "",
							n = e.payloadType;
						return e.preferredPayloadType !== undefined && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function (e) {
							t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
						}), t
					}, n.parseSsrcMedia = function (e) {
						var t = e.indexOf(" "),
							n = {
								ssrc: parseInt(e.substr(7, t - 7), 10)
							},
							i = e.indexOf(":", t);
						return i > -1 ? (n.attribute = e.substr(t + 1, i - t - 1), n.value = e.substr(i + 1)) : n.attribute = e.substr(t + 1), n
					}, n.parseSsrcGroup = function (e) {
						var t = e.substr(13).split(" ");
						return {
							semantics: t.shift(),
							ssrcs: t.map(function (e) {
								return parseInt(e, 10)
							})
						}
					}, n.getMid = function (e) {
						var t = n.matchPrefix(e, "a=mid:")[0];
						if (t) return t.substr(6)
					}, n.parseFingerprint = function (e) {
						var t = e.substr(14).split(" ");
						return {
							algorithm: t[0].toLowerCase(),
							value: t[1]
						}
					},
					n.getDtlsParameters = function (e, t) {
						return {
							role: "auto",
							fingerprints: n.matchPrefix(e + t, "a=fingerprint:").map(n.parseFingerprint)
						}
					}, n.writeDtlsParameters = function (e, t) {
						var n = "a=setup:" + t + "\r\n";
						return e.fingerprints.forEach(function (e) {
							n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
						}), n
					}, n.parseCryptoLine = function (e) {
						var t = e.substr(9).split(" ");
						return {
							tag: parseInt(t[0], 10),
							cryptoSuite: t[1],
							keyParams: t[2],
							sessionParams: t.slice(3)
						}
					}, n.writeCryptoLine = function (e) {
						return "a=crypto:" + e.tag + " " + e.cryptoSuite + " " + ("object" == typeof e.keyParams ? n.writeCryptoKeyParams(e.keyParams) : e.keyParams) + (e.sessionParams ? " " + e.sessionParams.join(" ") : "") + "\r\n"
					}, n.parseCryptoKeyParams = function (e) {
						if (0 !== e.indexOf("inline:")) return null;
						var t = e.substr(7).split("|");
						return {
							keyMethod: "inline",
							keySalt: t[0],
							lifeTime: t[1],
							mkiValue: t[2] ? t[2].split(":")[0] : undefined,
							mkiLength: t[2] ? t[2].split(":")[1] : undefined
						}
					}, n.writeCryptoKeyParams = function (e) {
						return e.keyMethod + ":" + e.keySalt + (e.lifeTime ? "|" + e.lifeTime : "") + (e.mkiValue && e.mkiLength ? "|" + e.mkiValue + ":" + e.mkiLength : "")
					}, n.getCryptoParameters = function (e, t) {
						return n.matchPrefix(e + t, "a=crypto:").map(n.parseCryptoLine)
					}, n.getIceParameters = function (e, t) {
						var i = n.matchPrefix(e + t, "a=ice-ufrag:")[0],
							r = n.matchPrefix(e + t, "a=ice-pwd:")[0];
						return i && r ? {
							usernameFragment: i.substr(12),
							password: r.substr(10)
						} : null
					}, n.writeIceParameters = function (e) {
						return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
					}, n.parseRtpParameters = function (e) {
						for (var t = {
								codecs: [],
								headerExtensions: [],
								fecMechanisms: [],
								rtcp: []
							}, i = n.splitLines(e)[0].split(" "), r = 3; r < i.length; r++) {
							var o = i[r],
								s = n.matchPrefix(e, "a=rtpmap:" + o + " ")[0];
							if (s) {
								var a = n.parseRtpMap(s),
									c = n.matchPrefix(e, "a=fmtp:" + o + " ");
								switch (a.parameters = c.length ? n.parseFmtp(c[0]) : {}, a.rtcpFeedback = n.matchPrefix(e, "a=rtcp-fb:" + o + " ").map(n.parseRtcpFb), t.codecs.push(a), a.name.toUpperCase()) {
									case "RED":
									case "ULPFEC":
										t.fecMechanisms.push(a.name.toUpperCase())
								}
							}
						}
						return n.matchPrefix(e, "a=extmap:").forEach(function (e) {
							t.headerExtensions.push(n.parseExtmap(e))
						}), t
					}, n.writeRtpDescription = function (e, t) {
						var i = "";
						i += "m=" + e + " ", i += t.codecs.length > 0 ? "9" : "0", i += " UDP/TLS/RTP/SAVPF ", i += t.codecs.map(function (e) {
							return e.preferredPayloadType !== undefined ? e.preferredPayloadType : e.payloadType
						}).join(" ") + "\r\n", i += "c=IN IP4 0.0.0.0\r\n", i += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach(function (e) {
							i += n.writeRtpMap(e), i += n.writeFmtp(e), i += n.writeRtcpFb(e)
						});
						var r = 0;
						return t.codecs.forEach(function (e) {
							e.maxptime > r && (r = e.maxptime)
						}), r > 0 && (i += "a=maxptime:" + r + "\r\n"), i += "a=rtcp-mux\r\n", t.headerExtensions && t.headerExtensions.forEach(function (e) {
							i += n.writeExtmap(e)
						}), i
					}, n.parseRtpEncodingParameters = function (e) {
						var t, i = [],
							r = n.parseRtpParameters(e),
							o = -1 !== r.fecMechanisms.indexOf("RED"),
							s = -1 !== r.fecMechanisms.indexOf("ULPFEC"),
							a = n.matchPrefix(e, "a=ssrc:").map(function (e) {
								return n.parseSsrcMedia(e)
							}).filter(function (e) {
								return "cname" === e.attribute
							}),
							c = a.length > 0 && a[0].ssrc,
							l = n.matchPrefix(e, "a=ssrc-group:FID").map(function (e) {
								return e.substr(17).split(" ").map(function (e) {
									return parseInt(e, 10)
								})
							});
						l.length > 0 && l[0].length > 1 && l[0][0] === c && (t = l[0][1]), r.codecs.forEach(function (e) {
							if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
								var n = {
									ssrc: c,
									codecPayloadType: parseInt(e.parameters.apt, 10)
								};
								c && t && (n.rtx = {
									ssrc: t
								}), i.push(n), o && ((n = JSON.parse(JSON.stringify(n))).fec = {
									ssrc: c,
									mechanism: s ? "red+ulpfec" : "red"
								}, i.push(n))
							}
						}), 0 === i.length && c && i.push({
							ssrc: c
						});
						var d = n.matchPrefix(e, "b=");
						return d.length && (d = 0 === d[0].indexOf("b=TIAS:") ? parseInt(d[0].substr(7), 10) : 0 === d[0].indexOf("b=AS:") ? 1e3 * parseInt(d[0].substr(5), 10) * .95 - 16e3 : undefined, i.forEach(function (e) {
							e.maxBitrate = d
						})), i
					}, n.parseRtcpParameters = function (e) {
						var t = {},
							i = n.matchPrefix(e, "a=ssrc:").map(function (e) {
								return n.parseSsrcMedia(e)
							}).filter(function (e) {
								return "cname" === e.attribute
							})[0];
						i && (t.cname = i.value, t.ssrc = i.ssrc);
						var r = n.matchPrefix(e, "a=rtcp-rsize");
						t.reducedSize = r.length > 0, t.compound = 0 === r.length;
						var o = n.matchPrefix(e, "a=rtcp-mux");
						return t.mux = o.length > 0, t
					}, n.parseMsid = function (e) {
						var t, i = n.matchPrefix(e, "a=msid:");
						if (1 === i.length) return {
							stream: (t = i[0].substr(7).split(" "))[0],
							track: t[1]
						};
						var r = n.matchPrefix(e, "a=ssrc:").map(function (e) {
							return n.parseSsrcMedia(e)
						}).filter(function (e) {
							return "msid" === e.attribute
						});
						return r.length > 0 ? {
							stream: (t = r[0].value.split(" "))[0],
							track: t[1]
						} : void 0
					}, n.parseSctpDescription = function (e) {
						var t, i = n.parseMLine(e),
							r = n.matchPrefix(e, "a=max-message-size:");
						r.length > 0 && (t = parseInt(r[0].substr(19), 10)), isNaN(t) && (t = 65536);
						var o = n.matchPrefix(e, "a=sctp-port:");
						if (o.length > 0) return {
							port: parseInt(o[0].substr(12), 10),
							protocol: i.fmt,
							maxMessageSize: t
						};
						if (n.matchPrefix(e, "a=sctpmap:").length > 0) {
							var s = n.matchPrefix(e, "a=sctpmap:")[0].substr(10).split(" ");
							return {
								port: parseInt(s[0], 10),
								protocol: s[1],
								maxMessageSize: t
							}
						}
					}, n.writeSctpDescription = function (e, t) {
						var n = [];
						return n = "DTLS/SCTP" !== e.protocol ? ["m=" + e.kind + " 9 " + e.protocol + " " + t.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + t.port + "\r\n"] : ["m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n"], t.maxMessageSize !== undefined && n.push("a=max-message-size:" + t.maxMessageSize + "\r\n"), n.join("")
					}, n.generateSessionId = function () {
						return Math.random().toString().substr(2, 21)
					}, n.writeSessionBoilerplate = function (e, t, i) {
						var r = t !== undefined ? t : 2;
						return "v=0\r\no=" + (i || "thisisadapterortc") + " " + (e || n.generateSessionId()) + " " + r + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
					}, n.writeMediaSection = function (e, t, i, r) {
						var o = n.writeRtpDescription(e.kind, t);
						if (o += n.writeIceParameters(e.iceGatherer.getLocalParameters()), o += n.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === i ? "actpass" : "active"), o += "a=mid:" + e.mid + "\r\n", e.direction ? o += "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? o += "a=sendrecv\r\n" : e.rtpSender ? o += "a=sendonly\r\n" : e.rtpReceiver ? o += "a=recvonly\r\n" : o += "a=inactive\r\n", e.rtpSender) {
							var s = "msid:" + r.id + " " + e.rtpSender.track.id + "\r\n";
							o += "a=" + s, o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + s, e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + s, o += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
						}
						return o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + n.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + n.localCName + "\r\n"), o
					}, n.getDirection = function (e, t) {
						for (var i = n.splitLines(e), r = 0; r < i.length; r++) switch (i[r]) {
							case "a=sendrecv":
							case "a=sendonly":
							case "a=recvonly":
							case "a=inactive":
								return i[r].substr(2)
						}
						return t ? n.getDirection(t) : "sendrecv"
					}, n.getKind = function (e) {
						return n.splitLines(e)[0].split(" ")[0].substr(2)
					}, n.isRejected = function (e) {
						return "0" === e.split(" ", 2)[1]
					}, n.parseMLine = function (e) {
						var t = n.splitLines(e)[0].substr(2).split(" ");
						return {
							kind: t[0],
							port: parseInt(t[1], 10),
							protocol: t[2],
							fmt: t.slice(3).join(" ")
						}
					}, n.parseOLine = function (e) {
						var t = n.matchPrefix(e, "o=")[0].substr(2).split(" ");
						return {
							username: t[0],
							sessionId: t[1],
							sessionVersion: parseInt(t[2], 10),
							netType: t[3],
							addressType: t[4],
							address: t[5]
						}
					}, n.isValidSDP = function (e) {
						if ("string" != typeof e || 0 === e.length) return !1;
						for (var t = n.splitLines(e), i = 0; i < t.length; i++)
							if (t[i].length < 2 || "=" !== t[i].charAt(1)) return !1;
						return !0
					}, "object" == typeof t && (t.exports = n)
			}, {}]
		}, {}, [1])(1)
	}),
	/*!
		autosize 4.0.2
		license: MIT
		http://www.jacklmoore.com/autosize
	*/
	function (e, t) {
		if ("function" == typeof define && define.amd) define(["module", "exports"], t);
		else if ("undefined" != typeof exports) t(module, exports);
		else {
			var n = {
				exports: {}
			};
			t(n, n.exports), e.autosize = n.exports
		}
	}(this, function (e, t) {
		"use strict";

		function n(e) {
			function t() {
				var t = window.getComputedStyle(e, null);
				"vertical" === t.resize ? e.style.resize = "none" : "both" === t.resize && (e.style.resize = "horizontal"), s = "content-box" === t.boxSizing ? -(parseFloat(t.paddingTop) + parseFloat(t.paddingBottom)) : parseFloat(t.borderTopWidth) + parseFloat(t.borderBottomWidth), isNaN(s) && (s = 0), o()
			}

			function n(t) {
				var n = e.style.width;
				e.style.width = "0px", e.offsetWidth, e.style.width = n, e.style.overflowY = t
			}

			function i(e) {
				for (var t = []; e && e.parentNode && e.parentNode instanceof Element;) e.parentNode.scrollTop && t.push({
					node: e.parentNode,
					scrollTop: e.parentNode.scrollTop
				}), e = e.parentNode;
				return t
			}

			function r() {
				if (0 !== e.scrollHeight) {
					var t = i(e),
						n = document.documentElement && document.documentElement.scrollTop;
					e.style.height = "", e.style.height = e.scrollHeight + s + "px", l = e.clientWidth, t.forEach(function (e) {
						e.node.scrollTop = e.scrollTop
					}), n && (document.documentElement.scrollTop = n)
				}
			}

			function o() {
				r();
				var t = Math.round(parseFloat(e.style.height)),
					i = window.getComputedStyle(e, null),
					o = "content-box" === i.boxSizing ? Math.round(parseFloat(i.height)) : e.offsetHeight;
				if (o < t ? "hidden" === i.overflowY && (n("scroll"), r(), o = "content-box" === i.boxSizing ? Math.round(parseFloat(window.getComputedStyle(e, null).height)) : e.offsetHeight) : "hidden" !== i.overflowY && (n("hidden"), r(), o = "content-box" === i.boxSizing ? Math.round(parseFloat(window.getComputedStyle(e, null).height)) : e.offsetHeight), d !== o) {
					d = o;
					var s = c("autosize:resized");
					try {
						e.dispatchEvent(s)
					} catch (a) {}
				}
			}
			if (e && e.nodeName && "TEXTAREA" === e.nodeName && !a.has(e)) {
				var s = null,
					l = null,
					d = null,
					u = function () {
						e.clientWidth !== l && o()
					},
					p = function (t) {
						window.removeEventListener("resize", u, !1), e.removeEventListener("input", o, !1), e.removeEventListener("keyup", o, !1), e.removeEventListener("autosize:destroy", p, !1), e.removeEventListener("autosize:update", o, !1), Object.keys(t).forEach(function (n) {
							e.style[n] = t[n]
						}), a["delete"](e)
					}.bind(e, {
						height: e.style.height,
						resize: e.style.resize,
						overflowY: e.style.overflowY,
						overflowX: e.style.overflowX,
						wordWrap: e.style.wordWrap
					});
				e.addEventListener("autosize:destroy", p, !1), "onpropertychange" in e && "oninput" in e && e.addEventListener("keyup", o, !1), window.addEventListener("resize", u, !1), e.addEventListener("input", o, !1), e.addEventListener("autosize:update", o, !1), e.style.overflowX = "hidden", e.style.wordWrap = "break-word", a.set(e, {
					destroy: p,
					update: o
				}), t()
			}
		}

		function i(e) {
			var t = a.get(e);
			t && t.destroy()
		}

		function r(e) {
			var t = a.get(e);
			t && t.update()
		}
		var o, s, a = "function" == typeof Map ? new Map : (o = [], s = [], {
				has: function (e) {
					return o.indexOf(e) > -1
				},
				get: function (e) {
					return s[o.indexOf(e)]
				},
				set: function (e, t) {
					-1 === o.indexOf(e) && (o.push(e), s.push(t))
				},
				"delete": function (e) {
					var t = o.indexOf(e);
					t > -1 && (o.splice(t, 1), s.splice(t, 1))
				}
			}),
			c = function (e) {
				return new Event(e, {
					bubbles: !0
				})
			};
		try {
			new Event("test")
		} catch (d) {
			c = function (e) {
				var t = document.createEvent("Event");
				return t.initEvent(e, !0, !1), t
			}
		}
		var l = null;
		"undefined" == typeof window || "function" != typeof window.getComputedStyle ? ((l = function (e) {
			return e
		}).destroy = function (e) {
			return e
		}, l.update = function (e) {
			return e
		}) : ((l = function (e, t) {
			return e && Array.prototype.forEach.call(e.length ? e : [e], function (e) {
				return n(e, t)
			}), e
		}).destroy = function (e) {
			return e && Array.prototype.forEach.call(e.length ? e : [e], i), e
		}, l.update = function (e) {
			return e && Array.prototype.forEach.call(e.length ? e : [e], r), e
		}), t["default"] = l, e.exports = t["default"]
	}),
	function (e, t) {
		"object" == typeof exports && "undefined" != typeof module ? t(exports, require("jquery")) : "function" == typeof define && define.amd ? define(["exports", "jquery"], t) : t((e = e || self).bootstrap = {}, e.jQuery)
	}(this, function (e, t) {
		"use strict";

		function n(e, t) {
			for (var n = 0; n < t.length; n++) {
				var i = t[n];
				i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
			}
		}

		function i(e, t, i) {
			return t && n(e.prototype, t), i && n(e, i), e
		}

		function r(e, t) {
			var n = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var i = Object.getOwnPropertySymbols(e);
				t && (i = i.filter(function (t) {
					return Object.getOwnPropertyDescriptor(e, t).enumerable
				})), n.push.apply(n, i)
			}
			return n
		}

		function o(e) {
			for (var t = 1; t < arguments.length; t++) {
				var n = null != arguments[t] ? arguments[t] : {};
				t % 2 ? r(Object(n), !0).forEach(function (t) {
					var i, r, o;
					i = e, o = n[r = t], r in i ? Object.defineProperty(i, r, {
						value: o,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : i[r] = o
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach(function (t) {
					Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
				})
			}
			return e
		}

		function s(e) {
			var n = this,
				i = !1;
			return t(this).one(G.TRANSITION_END, function () {
				i = !0
			}), setTimeout(function () {
				i || G.triggerTransitionEnd(n)
			}, e), this
		}

		function a(e) {
			return e && "[object Function]" === {}.toString.call(e)
		}

		function c(e, t) {
			if (1 !== e.nodeType) return [];
			var n = e.ownerDocument.defaultView.getComputedStyle(e, null);
			return t ? n[t] : n
		}

		function l(e) {
			return "HTML" === e.nodeName ? e : e.parentNode || e.host
		}

		function d(e) {
			if (!e) return document.body;
			switch (e.nodeName) {
				case "HTML":
				case "BODY":
					return e.ownerDocument.body;
				case "#document":
					return e.body
			}
			var t = c(e),
				n = t.overflow,
				i = t.overflowX,
				r = t.overflowY;
			return /(auto|scroll|overlay)/.test(n + r + i) ? e : d(l(e))
		}

		function u(e) {
			return e && e.referenceNode ? e.referenceNode : e
		}

		function p(e) {
			return 11 === e ? gt : 10 === e ? vt : gt || vt
		}

		function f(e) {
			if (!e) return document.documentElement;
			for (var t = p(10) ? document.body : null, n = e.offsetParent || null; n === t && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
			var i = n && n.nodeName;
			return i && "BODY" !== i && "HTML" !== i ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) && "static" === c(n, "position") ? f(n) : n : e ? e.ownerDocument.documentElement : document.documentElement
		}

		function h(e) {
			return null !== e.parentNode ? h(e.parentNode) : e
		}

		function m(e, t) {
			if (!(e && e.nodeType && t && t.nodeType)) return document.documentElement;
			var n = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
				i = n ? e : t,
				r = n ? t : e,
				o = document.createRange();
			o.setStart(i, 0), o.setEnd(r, 0);
			var s = o.commonAncestorContainer;
			if (e !== s && t !== s || i.contains(r)) return function (e) {
				var t = e.nodeName;
				return "BODY" !== t && ("HTML" === t || f(e.firstElementChild) === e)
			}(s) ? s : f(s);
			var a = h(e);
			return a.host ? m(a.host, t) : m(e, h(t).host)
		}

		function g(e, t) {
			var n = "top" === (1 < arguments.length && void 0 !== t ? t : "top") ? "scrollTop" : "scrollLeft",
				i = e.nodeName;
			if ("BODY" !== i && "HTML" !== i) return e[n];
			var r = e.ownerDocument.documentElement;
			return (e.ownerDocument.scrollingElement || r)[n]
		}

		function v(e, t) {
			var n = "x" === t ? "Left" : "Top",
				i = "Left" == n ? "Right" : "Bottom";
			return parseFloat(e["border" + n + "Width"], 10) + parseFloat(e["border" + i + "Width"], 10)
		}

		function y(e, t, n, i) {
			return Math.max(t["offset" + e], t["scroll" + e], n["client" + e], n["offset" + e], n["scroll" + e], p(10) ? parseInt(n["offset" + e]) + parseInt(i["margin" + ("Height" === e ? "Top" : "Left")]) + parseInt(i["margin" + ("Height" === e ? "Bottom" : "Right")]) : 0)
		}

		function A(e) {
			var t = e.body,
				n = e.documentElement,
				i = p(10) && getComputedStyle(n);
			return {
				height: y("Height", t, n, i),
				width: y("Width", t, n, i)
			}
		}

		function b(e, t) {
			for (var n = 0; n < t.length; n++) {
				var i = t[n];
				i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
			}
		}

		function w(e, t, n) {
			return t in e ? Object.defineProperty(e, t, {
				value: n,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = n, e
		}

		function S(e) {
			return At({}, e, {
				right: e.left + e.width,
				bottom: e.top + e.height
			})
		}

		function C(e) {
			var t = {};
			try {
				if (p(10)) {
					t = e.getBoundingClientRect();
					var n = g(e, "top"),
						i = g(e, "left");
					t.top += n, t.left += i, t.bottom += n, t.right += i
				} else t = e.getBoundingClientRect()
			} catch (e) {}
			var r = {
					left: t.left,
					top: t.top,
					width: t.right - t.left,
					height: t.bottom - t.top
				},
				o = "HTML" === e.nodeName ? A(e.ownerDocument) : {},
				s = o.width || e.clientWidth || r.width,
				a = o.height || e.clientHeight || r.height,
				l = e.offsetWidth - s,
				d = e.offsetHeight - a;
			if (l || d) {
				var u = c(e);
				l -= v(u, "x"), d -= v(u, "y"), r.width -= l, r.height -= d
			}
			return S(r)
		}

		function T(e, t, n) {
			var i = 2 < arguments.length && void 0 !== n && n,
				r = p(10),
				o = "HTML" === t.nodeName,
				s = C(e),
				a = C(t),
				l = d(e),
				u = c(t),
				f = parseFloat(u.borderTopWidth, 10),
				h = parseFloat(u.borderLeftWidth, 10);
			i && o && (a.top = Math.max(a.top, 0), a.left = Math.max(a.left, 0));
			var m = S({
				top: s.top - a.top - f,
				left: s.left - a.left - h,
				width: s.width,
				height: s.height
			});
			if (m.marginTop = 0, m.marginLeft = 0, !r && o) {
				var v = parseFloat(u.marginTop, 10),
					y = parseFloat(u.marginLeft, 10);
				m.top -= f - v, m.bottom -= f - v, m.left -= h - y, m.right -= h - y, m.marginTop = v, m.marginLeft = y
			}
			return (r && !i ? t.contains(l) : t === l && "BODY" !== l.nodeName) && (m = function (e, t, n) {
				var i = 2 < arguments.length && void 0 !== n && n,
					r = g(t, "top"),
					o = g(t, "left"),
					s = i ? -1 : 1;
				return e.top += r * s, e.bottom += r * s, e.left += o * s, e.right += o * s, e
			}(m, t)), m
		}

		function x(e) {
			if (!e || !e.parentElement || p()) return document.documentElement;
			for (var t = e.parentElement; t && "none" === c(t, "transform");) t = t.parentElement;
			return t || document.documentElement
		}

		function k(e, t, n, i, r) {
			var o = 4 < arguments.length && void 0 !== r && r,
				s = {
					top: 0,
					left: 0
				},
				a = o ? x(e) : m(e, u(t));
			if ("viewport" === i) s = function (e, t) {
				var n = 1 < arguments.length && void 0 !== t && t,
					i = e.ownerDocument.documentElement,
					r = T(e, i),
					o = Math.max(i.clientWidth, window.innerWidth || 0),
					s = Math.max(i.clientHeight, window.innerHeight || 0),
					a = n ? 0 : g(i),
					c = n ? 0 : g(i, "left");
				return S({
					top: a - r.top + r.marginTop,
					left: c - r.left + r.marginLeft,
					width: o,
					height: s
				})
			}(a, o);
			else {
				var p = void 0;
				"scrollParent" === i ? "BODY" === (p = d(l(t))).nodeName && (p = e.ownerDocument.documentElement) : p = "window" === i ? e.ownerDocument.documentElement : i;
				var f = T(p, a, o);
				if ("HTML" !== p.nodeName || function n(e) {
						var t = e.nodeName;
						if ("BODY" === t || "HTML" === t) return !1;
						if ("fixed" === c(e, "position")) return !0;
						var i = l(e);
						return !!i && n(i)
					}(a)) s = f;
				else {
					var h = A(e.ownerDocument),
						v = h.height,
						y = h.width;
					s.top += f.top - f.marginTop, s.bottom = v + f.top, s.left += f.left - f.marginLeft, s.right = y + f.left
				}
			}
			var b = "number" == typeof (n = n || 0);
			return s.left += b ? n : n.left || 0, s.top += b ? n : n.top || 0, s.right -= b ? n : n.right || 0, s.bottom -= b ? n : n.bottom || 0, s
		}

		function _(e, t, n, i, r, o) {
			var s = 5 < arguments.length && void 0 !== o ? o : 0;
			if (-1 === e.indexOf("auto")) return e;
			var a = k(n, i, s, r),
				c = {
					top: {
						width: a.width,
						height: t.top - a.top
					},
					right: {
						width: a.right - t.right,
						height: a.height
					},
					bottom: {
						width: a.width,
						height: a.bottom - t.bottom
					},
					left: {
						width: t.left - a.left,
						height: a.height
					}
				},
				l = Object.keys(c).map(function (e) {
					return At({
						key: e
					}, c[e], {
						area: function (e) {
							return e.width * e.height
						}(c[e])
					})
				}).sort(function (e, t) {
					return t.area - e.area
				}),
				d = l.filter(function (e) {
					var t = e.width,
						i = e.height;
					return t >= n.clientWidth && i >= n.clientHeight
				}),
				u = 0 < d.length ? d[0].key : l[0].key,
				p = e.split("-")[1];
			return u + (p ? "-" + p : "")
		}

		function E(e, t, n, i) {
			var r = 3 < arguments.length && void 0 !== i ? i : null;
			return T(n, r ? x(t) : m(t, u(n)), r)
		}

		function P(e) {
			var t = e.ownerDocument.defaultView.getComputedStyle(e),
				n = parseFloat(t.marginTop || 0) + parseFloat(t.marginBottom || 0),
				i = parseFloat(t.marginLeft || 0) + parseFloat(t.marginRight || 0);
			return {
				width: e.offsetWidth + i,
				height: e.offsetHeight + n
			}
		}

		function D(e) {
			var t = {
				left: "right",
				right: "left",
				bottom: "top",
				top: "bottom"
			};
			return e.replace(/left|right|bottom|top/g, function (e) {
				return t[e]
			})
		}

		function $(e, t, n) {
			n = n.split("-")[0];
			var i = P(e),
				r = {
					width: i.width,
					height: i.height
				},
				o = -1 !== ["right", "left"].indexOf(n),
				s = o ? "top" : "left",
				a = o ? "left" : "top",
				c = o ? "height" : "width",
				l = o ? "width" : "height";
			return r[s] = t[s] + t[c] / 2 - i[c] / 2, r[a] = n === a ? t[a] - i[l] : t[D(a)], r
		}

		function R(e, t) {
			return Array.prototype.find ? e.find(t) : e.filter(t)[0]
		}

		function I(e, t, n) {
			return (void 0 === n ? e : e.slice(0, function (e, t, n) {
				if (Array.prototype.findIndex) return e.findIndex(function (e) {
					return e[t] === n
				});
				var i = R(e, function (e) {
					return e[t] === n
				});
				return e.indexOf(i)
			}(e, "name", n))).forEach(function (e) {
				e["function"] && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
				var n = e["function"] || e.fn;
				e.enabled && a(n) && (t.offsets.popper = S(t.offsets.popper), t.offsets.reference = S(t.offsets.reference), t = n(t, e))
			}), t
		}

		function O(e, t) {
			return e.some(function (e) {
				var n = e.name;
				return e.enabled && n === t
			})
		}

		function L(e) {
			for (var t = [!1, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), i = 0; i < t.length; i++) {
				var r = t[i],
					o = r ? "" + r + n : e;
				if ("undefined" != typeof document.body.style[o]) return o
			}
			return null
		}

		function M(e) {
			var t = e.ownerDocument;
			return t ? t.defaultView : window
		}

		function j(e, t, n, i) {
			n.updateBound = i, M(e).addEventListener("resize", n.updateBound, {
				passive: !0
			});
			var r = d(e);
			return function o(e, t, n, i) {
				var r = "BODY" === e.nodeName,
					s = r ? e.ownerDocument.defaultView : e;
				s.addEventListener(t, n, {
					passive: !0
				}), r || o(d(s.parentNode), t, n, i), i.push(s)
			}(r, "scroll", n.updateBound, n.scrollParents), n.scrollElement = r, n.eventsEnabled = !0, n
		}

		function N() {
			var e, t;
			this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = (e = this.reference, t = this.state, M(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function (e) {
				e.removeEventListener("scroll", t.updateBound)
			}), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t))
		}

		function J(e) {
			return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
		}

		function H(e, t) {
			Object.keys(t).forEach(function (n) {
				var i = ""; - 1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(n) && J(t[n]) && (i = "px"), e.style[n] = t[n] + i
			})
		}

		function F(e, t) {
			function n(e) {
				return e
			}
			var i = e.offsets,
				r = i.popper,
				o = i.reference,
				s = Math.round,
				a = Math.floor,
				c = s(o.width),
				l = s(r.width),
				d = -1 !== ["left", "right"].indexOf(e.placement),
				u = -1 !== e.placement.indexOf("-"),
				p = t ? d || u || c % 2 == l % 2 ? s : a : n,
				f = t ? s : n;
			return {
				left: p(c % 2 == 1 && l % 2 == 1 && !u && t ? r.left - 1 : r.left),
				top: f(r.top),
				bottom: f(r.bottom),
				right: p(r.right)
			}
		}

		function B(e, t, n) {
			var i = R(e, function (e) {
					return e.name === t
				}),
				r = !!i && e.some(function (e) {
					return e.name === n && e.enabled && e.order < i.order
				});
			if (!r) {
				var o = "`" + t + "`",
					s = "`" + n + "`";
				console.warn(s + " modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")
			}
			return r
		}

		function q(e, t) {
			var n = 1 < arguments.length && void 0 !== t && t,
				i = St.indexOf(e),
				r = St.slice(i + 1).concat(St.slice(0, i));
			return n ? r.reverse() : r
		}

		function z(e, t, n, i) {
			var r = [0, 0],
				o = -1 !== ["right", "left"].indexOf(i),
				s = e.split(/(\+|\-)/).map(function (e) {
					return e.trim()
				}),
				a = s.indexOf(R(s, function (e) {
					return -1 !== e.search(/,|\s/)
				}));
			s[a] && -1 === s[a].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
			var c = /\s*,\s*|\s+/,
				l = -1 !== a ? [s.slice(0, a).concat([s[a].split(c)[0]]), [s[a].split(c)[1]].concat(s.slice(a + 1))] : [s];
			return (l = l.map(function (e, i) {
				var r = (1 === i ? !o : o) ? "height" : "width",
					s = !1;
				return e.reduce(function (e, t) {
					return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, s = !0, e) : s ? (e[e.length - 1] += t, s = !1, e) : e.concat(t)
				}, []).map(function (e) {
					return function (e, t, n, i) {
						var r = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
							o = +r[1],
							s = r[2];
						if (!o) return e;
						if (0 !== s.indexOf("%")) return "vh" !== s && "vw" !== s ? o : ("vh" === s ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * o;
						var a = void 0;
						switch (s) {
							case "%p":
								a = n;
								break;
							case "%":
							case "%r":
							default:
								a = i
						}
						return S(a)[t] / 100 * o
					}(e, r, t, n)
				})
			})).forEach(function (e, t) {
				e.forEach(function (n, i) {
					J(n) && (r[t] += n * ("-" === e[i - 1] ? -1 : 1))
				})
			}), r
		}

		function W(e, t) {
			var n = this,
				i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
			! function (e) {
				if (!(e instanceof W)) throw new TypeError("Cannot call a class as a function")
			}(this), this.scheduleUpdate = function () {
				return requestAnimationFrame(n.update)
			}, this.update = mt(this.update.bind(this)), this.options = At({}, W.Defaults, i), this.state = {
				isDestroyed: !1,
				isCreated: !1,
				scrollParents: []
			}, this.reference = e && e.jquery ? e[0] : e, this.popper = t && t.jquery ? t[0] : t, this.options.modifiers = {}, Object.keys(At({}, W.Defaults.modifiers, i.modifiers)).forEach(function (e) {
				n.options.modifiers[e] = At({}, W.Defaults.modifiers[e] || {}, i.modifiers ? i.modifiers[e] : {})
			}), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
				return At({
					name: e
				}, n.options.modifiers[e])
			}).sort(function (e, t) {
				return e.order - t.order
			}), this.modifiers.forEach(function (e) {
				e.enabled && a(e.onLoad) && e.onLoad(n.reference, n.popper, n.options, e, n.state)
			}), this.update();
			var r = this.options.eventsEnabled;
			r && this.enableEventListeners(), this.state.eventsEnabled = r
		}

		function U(e, t, n) {
			if (0 === e.length) return e;
			if (n && "function" == typeof n) return n(e);
			for (var i = (new window.DOMParser).parseFromString(e, "text/html"), r = Object.keys(t), o = [].slice.call(i.body.querySelectorAll("*")), s = function (e) {
					var n = o[e],
						i = n.nodeName.toLowerCase();
					if (-1 === r.indexOf(n.nodeName.toLowerCase())) return n.parentNode.removeChild(n), "continue";
					var s = [].slice.call(n.attributes),
						a = [].concat(t["*"] || [], t[i] || []);
					s.forEach(function (e) {
						! function (e, t) {
							var n = e.nodeName.toLowerCase();
							if (-1 !== t.indexOf(n)) return -1 === Tn.indexOf(n) || Boolean(e.nodeValue.match(kn) || e.nodeValue.match(_n));
							for (var i = t.filter(function (e) {
									return e instanceof RegExp
								}), r = 0, o = i.length; r < o; r++)
								if (n.match(i[r])) return !0;
							return !1
						}(e, a) && n.removeAttribute(e.nodeName)
					})
				}, a = 0, c = o.length; a < c; a++) s(a);
			return i.body.innerHTML
		}
		t = t && t.hasOwnProperty("default") ? t["default"] : t;
		var V = "transitionend",
			G = {
				TRANSITION_END: "bsTransitionEnd",
				getUID: function (e) {
					for (; e += ~~(1e6 * Math.random()), document.getElementById(e););
					return e
				},
				getSelectorFromElement: function (e) {
					var t = e.getAttribute("data-target");
					if (!t || "#" === t) {
						var n = e.getAttribute("href");
						t = n && "#" !== n ? n.trim() : ""
					}
					try {
						return document.querySelector(t) ? t : null
					} catch (e) {
						return null
					}
				},
				getTransitionDurationFromElement: function (e) {
					if (!e) return 0;
					var n = t(e).css("transition-duration"),
						i = t(e).css("transition-delay"),
						r = parseFloat(n),
						o = parseFloat(i);
					return r || o ? (n = n.split(",")[0], i = i.split(",")[0], 1e3 * (parseFloat(n) + parseFloat(i))) : 0
				},
				reflow: function (e) {
					return e.offsetHeight
				},
				triggerTransitionEnd: function (e) {
					t(e).trigger(V)
				},
				supportsTransitionEnd: function () {
					return Boolean(V)
				},
				isElement: function (e) {
					return (e[0] || e).nodeType
				},
				typeCheckConfig: function (e, t, n) {
					for (var i in n)
						if (Object.prototype.hasOwnProperty.call(n, i)) {
							var r = n[i],
								o = t[i],
								s = o && G.isElement(o) ? "element" : (a = o, {}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());
							if (!new RegExp(r).test(s)) throw new Error(e.toUpperCase() + ': Option "' + i + '" provided type "' + s + '" but expected type "' + r + '".')
						} var a
				},
				findShadowRoot: function (e) {
					if (!document.documentElement.attachShadow) return null;
					if ("function" != typeof e.getRootNode) return e instanceof ShadowRoot ? e : e.parentNode ? G.findShadowRoot(e.parentNode) : null;
					var t = e.getRootNode();
					return t instanceof ShadowRoot ? t : null
				},
				jQueryDetection: function () {
					if (void 0 === t) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
					var e = t.fn.jquery.split(" ")[0].split(".");
					if (e[0] < 2 && e[1] < 9 || 1 === e[0] && 9 === e[1] && e[2] < 1 || 4 <= e[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
				}
			};
		G.jQueryDetection(), t.fn.emulateTransitionEnd = s, t.event.special[G.TRANSITION_END] = {
			bindType: V,
			delegateType: V,
			handle: function (e) {
				if (t(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
			}
		};
		var Q = "alert",
			Y = "bs.alert",
			X = "." + Y,
			K = t.fn[Q],
			Z = {
				CLOSE: "close" + X,
				CLOSED: "closed" + X,
				CLICK_DATA_API: "click" + X + ".data-api"
			},
			ee = "alert",
			te = "fade",
			ne = "show",
			ie = function () {
				function e(e) {
					this._element = e
				}
				var n = e.prototype;
				return n.close = function (e) {
					var t = this._element;
					e && (t = this._getRootElement(e)), this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
				}, n.dispose = function () {
					t.removeData(this._element, Y), this._element = null
				}, n._getRootElement = function (e) {
					var n = G.getSelectorFromElement(e),
						i = !1;
					return n && (i = document.querySelector(n)), i || t(e).closest("." + ee)[0]
				}, n._triggerCloseEvent = function (e) {
					var n = t.Event(Z.CLOSE);
					return t(e).trigger(n), n
				}, n._removeElement = function (e) {
					var n = this;
					if (t(e).removeClass(ne), t(e).hasClass(te)) {
						var i = G.getTransitionDurationFromElement(e);
						t(e).one(G.TRANSITION_END, function (t) {
							return n._destroyElement(e, t)
						}).emulateTransitionEnd(i)
					} else this._destroyElement(e)
				}, n._destroyElement = function (e) {
					t(e).detach().trigger(Z.CLOSED).remove()
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this),
							r = i.data(Y);
						r || (r = new e(this), i.data(Y, r)), "close" === n && r[n](this)
					})
				}, e._handleDismiss = function (e) {
					return function (t) {
						t && t.preventDefault(), e.close(this)
					}
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}]), e
			}();
		t(document).on(Z.CLICK_DATA_API, '[data-dismiss="alert"]', ie._handleDismiss(new ie)), t.fn[Q] = ie._jQueryInterface, t.fn[Q].Constructor = ie, t.fn[Q].noConflict = function () {
			return t.fn[Q] = K, ie._jQueryInterface
		};
		var re = "button",
			oe = "bs.button",
			se = "." + oe,
			ae = ".data-api",
			ce = t.fn[re],
			le = "active",
			de = "btn",
			ue = "focus",
			pe = '[data-toggle^="button"]',
			fe = '[data-toggle="buttons"]',
			he = '[data-toggle="button"]',
			me = '[data-toggle="buttons"] .btn',
			ge = 'input:not([type="hidden"])',
			ve = ".active",
			ye = ".btn",
			Ae = {
				CLICK_DATA_API: "click" + se + ae,
				FOCUS_BLUR_DATA_API: "focus" + se + ae + " blur" + se + ae,
				LOAD_DATA_API: "load" + se + ae
			},
			be = function () {
				function e(e) {
					this._element = e
				}
				var n = e.prototype;
				return n.toggle = function () {
					var e = !0,
						n = !0,
						i = t(this._element).closest(fe)[0];
					if (i) {
						var r = this._element.querySelector(ge);
						if (r) {
							if ("radio" === r.type)
								if (r.checked && this._element.classList.contains(le)) e = !1;
								else {
									var o = i.querySelector(ve);
									o && t(o).removeClass(le)
								}
							else "checkbox" === r.type ? "LABEL" === this._element.tagName && r.checked === this._element.classList.contains(le) && (e = !1) : e = !1;
							e && (r.checked = !this._element.classList.contains(le), t(r).trigger("change")), r.focus(), n = !1
						}
					}
					this._element.hasAttribute("disabled") || this._element.classList.contains("disabled") || (n && this._element.setAttribute("aria-pressed", !this._element.classList.contains(le)), e && t(this._element).toggleClass(le))
				}, n.dispose = function () {
					t.removeData(this._element, oe), this._element = null
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this).data(oe);
						i || (i = new e(this), t(this).data(oe, i)), "toggle" === n && i[n]()
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}]), e
			}();
		t(document).on(Ae.CLICK_DATA_API, pe, function (e) {
			var n = e.target;
			if (t(n).hasClass(de) || (n = t(n).closest(ye)[0]), !n || n.hasAttribute("disabled") || n.classList.contains("disabled")) e.preventDefault();
			else {
				var i = n.querySelector(ge);
				if (i && (i.hasAttribute("disabled") || i.classList.contains("disabled"))) return void e.preventDefault();
				be._jQueryInterface.call(t(n), "toggle")
			}
		}).on(Ae.FOCUS_BLUR_DATA_API, pe, function (e) {
			var n = t(e.target).closest(ye)[0];
			t(n).toggleClass(ue, /^focus(in)?$/.test(e.type))
		}), t(window).on(Ae.LOAD_DATA_API, function () {
			for (var e = [].slice.call(document.querySelectorAll(me)), t = 0, n = e.length; t < n; t++) {
				var i = e[t],
					r = i.querySelector(ge);
				r.checked || r.hasAttribute("checked") ? i.classList.add(le) : i.classList.remove(le)
			}
			for (var o = 0, s = (e = [].slice.call(document.querySelectorAll(he))).length; o < s; o++) {
				var a = e[o];
				"true" === a.getAttribute("aria-pressed") ? a.classList.add(le) : a.classList.remove(le)
			}
		}), t.fn[re] = be._jQueryInterface, t.fn[re].Constructor = be, t.fn[re].noConflict = function () {
			return t.fn[re] = ce, be._jQueryInterface
		};
		var we = "carousel",
			Se = "bs.carousel",
			Ce = "." + Se,
			Te = ".data-api",
			xe = t.fn[we],
			ke = {
				interval: 5e3,
				keyboard: !0,
				slide: !1,
				pause: "hover",
				wrap: !0,
				touch: !0
			},
			_e = {
				interval: "(number|boolean)",
				keyboard: "boolean",
				slide: "(boolean|string)",
				pause: "(string|boolean)",
				wrap: "boolean",
				touch: "boolean"
			},
			Ee = "next",
			Pe = "prev",
			De = "left",
			$e = "right",
			Re = {
				SLIDE: "slide" + Ce,
				SLID: "slid" + Ce,
				KEYDOWN: "keydown" + Ce,
				MOUSEENTER: "mouseenter" + Ce,
				MOUSELEAVE: "mouseleave" + Ce,
				TOUCHSTART: "touchstart" + Ce,
				TOUCHMOVE: "touchmove" + Ce,
				TOUCHEND: "touchend" + Ce,
				POINTERDOWN: "pointerdown" + Ce,
				POINTERUP: "pointerup" + Ce,
				DRAG_START: "dragstart" + Ce,
				LOAD_DATA_API: "load" + Ce + Te,
				CLICK_DATA_API: "click" + Ce + Te
			},
			Ie = "carousel",
			Oe = "active",
			Le = "slide",
			Me = "carousel-item-right",
			je = "carousel-item-left",
			Ne = "carousel-item-next",
			Je = "carousel-item-prev",
			He = "pointer-event",
			Fe = ".active",
			Be = ".active.carousel-item",
			qe = ".carousel-item",
			ze = ".carousel-item img",
			We = ".carousel-item-next, .carousel-item-prev",
			Ue = ".carousel-indicators",
			Ve = "[data-slide], [data-slide-to]",
			Ge = '[data-ride="carousel"]',
			Qe = {
				TOUCH: "touch",
				PEN: "pen"
			},
			Ye = function () {
				function e(e, t) {
					this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(t), this._element = e, this._indicatorsElement = this._element.querySelector(Ue), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners()
				}
				var n = e.prototype;
				return n.next = function () {
					this._isSliding || this._slide(Ee)
				}, n.nextWhenVisible = function () {
					!document.hidden && t(this._element).is(":visible") && "hidden" !== t(this._element).css("visibility") && this.next()
				}, n.prev = function () {
					this._isSliding || this._slide(Pe)
				}, n.pause = function (e) {
					e || (this._isPaused = !0), this._element.querySelector(We) && (G.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
				}, n.cycle = function (e) {
					e || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
				}, n.to = function (e) {
					var n = this;
					this._activeElement = this._element.querySelector(Be);
					var i = this._getItemIndex(this._activeElement);
					if (!(e > this._items.length - 1 || e < 0))
						if (this._isSliding) t(this._element).one(Re.SLID, function () {
							return n.to(e)
						});
						else {
							if (i === e) return this.pause(), void this.cycle();
							var r = i < e ? Ee : Pe;
							this._slide(r, this._items[e])
						}
				}, n.dispose = function () {
					t(this._element).off(Ce), t.removeData(this._element, Se), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
				}, n._getConfig = function (e) {
					return e = o({}, ke, {}, e), G.typeCheckConfig(we, e, _e), e
				}, n._handleSwipe = function () {
					var e = Math.abs(this.touchDeltaX);
					if (!(e <= 40)) {
						var t = e / this.touchDeltaX;
						(this.touchDeltaX = 0) < t && this.prev(), t < 0 && this.next()
					}
				}, n._addEventListeners = function () {
					var e = this;
					this._config.keyboard && t(this._element).on(Re.KEYDOWN, function (t) {
						return e._keydown(t)
					}), "hover" === this._config.pause && t(this._element).on(Re.MOUSEENTER, function (t) {
						return e.pause(t)
					}).on(Re.MOUSELEAVE, function (t) {
						return e.cycle(t)
					}), this._config.touch && this._addTouchEventListeners()
				}, n._addTouchEventListeners = function () {
					var e = this;
					if (this._touchSupported) {
						var n = function (t) {
								e._pointerEvent && Qe[t.originalEvent.pointerType.toUpperCase()] ? e.touchStartX = t.originalEvent.clientX : e._pointerEvent || (e.touchStartX = t.originalEvent.touches[0].clientX)
							},
							i = function (t) {
								e._pointerEvent && Qe[t.originalEvent.pointerType.toUpperCase()] && (e.touchDeltaX = t.originalEvent.clientX - e.touchStartX), e._handleSwipe(), "hover" === e._config.pause && (e.pause(), e.touchTimeout && clearTimeout(e.touchTimeout), e.touchTimeout = setTimeout(function (t) {
									return e.cycle(t)
								}, 500 + e._config.interval))
							};
						t(this._element.querySelectorAll(ze)).on(Re.DRAG_START, function (e) {
							return e.preventDefault()
						}), this._pointerEvent ? (t(this._element).on(Re.POINTERDOWN, function (e) {
							return n(e)
						}), t(this._element).on(Re.POINTERUP, function (e) {
							return i(e)
						}), this._element.classList.add(He)) : (t(this._element).on(Re.TOUCHSTART, function (e) {
							return n(e)
						}), t(this._element).on(Re.TOUCHMOVE, function (t) {
							return function (t) {
								t.originalEvent.touches && 1 < t.originalEvent.touches.length ? e.touchDeltaX = 0 : e.touchDeltaX = t.originalEvent.touches[0].clientX - e.touchStartX
							}(t)
						}), t(this._element).on(Re.TOUCHEND, function (e) {
							return i(e)
						}))
					}
				}, n._keydown = function (e) {
					if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
						case 37:
							e.preventDefault(), this.prev();
							break;
						case 39:
							e.preventDefault(), this.next()
					}
				}, n._getItemIndex = function (e) {
					return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll(qe)) : [], this._items.indexOf(e)
				}, n._getItemByDirection = function (e, t) {
					var n = e === Ee,
						i = e === Pe,
						r = this._getItemIndex(t),
						o = this._items.length - 1;
					if ((i && 0 === r || n && r === o) && !this._config.wrap) return t;
					var s = (r + (e === Pe ? -1 : 1)) % this._items.length;
					return -1 == s ? this._items[this._items.length - 1] : this._items[s]
				}, n._triggerSlideEvent = function (e, n) {
					var i = this._getItemIndex(e),
						r = this._getItemIndex(this._element.querySelector(Be)),
						o = t.Event(Re.SLIDE, {
							relatedTarget: e,
							direction: n,
							from: r,
							to: i
						});
					return t(this._element).trigger(o), o
				}, n._setActiveIndicatorElement = function (e) {
					if (this._indicatorsElement) {
						var n = [].slice.call(this._indicatorsElement.querySelectorAll(Fe));
						t(n).removeClass(Oe);
						var i = this._indicatorsElement.children[this._getItemIndex(e)];
						i && t(i).addClass(Oe)
					}
				}, n._slide = function (e, n) {
					var i, r, o, s = this,
						a = this._element.querySelector(Be),
						c = this._getItemIndex(a),
						l = n || a && this._getItemByDirection(e, a),
						d = this._getItemIndex(l),
						u = Boolean(this._interval);
					if (o = e === Ee ? (i = je, r = Ne, De) : (i = Me, r = Je, $e), l && t(l).hasClass(Oe)) this._isSliding = !1;
					else if (!this._triggerSlideEvent(l, o).isDefaultPrevented() && a && l) {
						this._isSliding = !0, u && this.pause(), this._setActiveIndicatorElement(l);
						var p = t.Event(Re.SLID, {
							relatedTarget: l,
							direction: o,
							from: c,
							to: d
						});
						if (t(this._element).hasClass(Le)) {
							t(l).addClass(r), G.reflow(l), t(a).addClass(i), t(l).addClass(i);
							var f = parseInt(l.getAttribute("data-interval"), 10);
							f ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = f) : this._config.interval = this._config.defaultInterval || this._config.interval;
							var h = G.getTransitionDurationFromElement(a);
							t(a).one(G.TRANSITION_END, function () {
								t(l).removeClass(i + " " + r).addClass(Oe), t(a).removeClass(Oe + " " + r + " " + i), s._isSliding = !1, setTimeout(function () {
									return t(s._element).trigger(p)
								}, 0)
							}).emulateTransitionEnd(h)
						} else t(a).removeClass(Oe), t(l).addClass(Oe), this._isSliding = !1, t(this._element).trigger(p);
						u && this.cycle()
					}
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this).data(Se),
							r = o({}, ke, {}, t(this).data());
						"object" == typeof n && (r = o({}, r, {}, n));
						var s = "string" == typeof n ? n : r.slide;
						if (i || (i = new e(this, r), t(this).data(Se, i)), "number" == typeof n) i.to(n);
						else if ("string" == typeof s) {
							if ("undefined" == typeof i[s]) throw new TypeError('No method named "' + s + '"');
							i[s]()
						} else r.interval && r.ride && (i.pause(), i.cycle())
					})
				}, e._dataApiClickHandler = function (n) {
					var i = G.getSelectorFromElement(this);
					if (i) {
						var r = t(i)[0];
						if (r && t(r).hasClass(Ie)) {
							var s = o({}, t(r).data(), {}, t(this).data()),
								a = this.getAttribute("data-slide-to");
							a && (s.interval = !1), e._jQueryInterface.call(t(r), s), a && t(r).data(Se).to(a), n.preventDefault()
						}
					}
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return ke
					}
				}]), e
			}();
		t(document).on(Re.CLICK_DATA_API, Ve, Ye._dataApiClickHandler), t(window).on(Re.LOAD_DATA_API, function () {
			for (var e = [].slice.call(document.querySelectorAll(Ge)), n = 0, i = e.length; n < i; n++) {
				var r = t(e[n]);
				Ye._jQueryInterface.call(r, r.data())
			}
		}), t.fn[we] = Ye._jQueryInterface, t.fn[we].Constructor = Ye, t.fn[we].noConflict = function () {
			return t.fn[we] = xe, Ye._jQueryInterface
		};
		var Xe = "collapse",
			Ke = "bs.collapse",
			Ze = "." + Ke,
			et = t.fn[Xe],
			tt = {
				toggle: !0,
				parent: ""
			},
			nt = {
				toggle: "boolean",
				parent: "(string|element)"
			},
			it = {
				SHOW: "show" + Ze,
				SHOWN: "shown" + Ze,
				HIDE: "hide" + Ze,
				HIDDEN: "hidden" + Ze,
				CLICK_DATA_API: "click" + Ze + ".data-api"
			},
			rt = "show",
			ot = "collapse",
			st = "collapsing",
			at = "collapsed",
			ct = "width",
			lt = "height",
			dt = ".show, .collapsing",
			ut = '[data-toggle="collapse"]',
			pt = function () {
				function e(e, t) {
					this._isTransitioning = !1, this._element = e, this._config = this._getConfig(t), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'));
					for (var n = [].slice.call(document.querySelectorAll(ut)), i = 0, r = n.length; i < r; i++) {
						var o = n[i],
							s = G.getSelectorFromElement(o),
							a = [].slice.call(document.querySelectorAll(s)).filter(function (t) {
								return t === e
							});
						null !== s && 0 < a.length && (this._selector = s, this._triggerArray.push(o))
					}
					this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
				}
				var n = e.prototype;
				return n.toggle = function () {
					t(this._element).hasClass(rt) ? this.hide() : this.show()
				}, n.show = function () {
					var n, i, r = this;
					if (!(this._isTransitioning || t(this._element).hasClass(rt) || (this._parent && 0 === (n = [].slice.call(this._parent.querySelectorAll(dt)).filter(function (e) {
							return "string" == typeof r._config.parent ? e.getAttribute("data-parent") === r._config.parent : e.classList.contains(ot)
						})).length && (n = null), n && (i = t(n).not(this._selector).data(Ke)) && i._isTransitioning))) {
						var o = t.Event(it.SHOW);
						if (t(this._element).trigger(o), !o.isDefaultPrevented()) {
							n && (e._jQueryInterface.call(t(n).not(this._selector), "hide"), i || t(n).data(Ke, null));
							var s = this._getDimension();
							t(this._element).removeClass(ot).addClass(st), this._element.style[s] = 0, this._triggerArray.length && t(this._triggerArray).removeClass(at).attr("aria-expanded", !0), this.setTransitioning(!0);
							var a = "scroll" + (s[0].toUpperCase() + s.slice(1)),
								c = G.getTransitionDurationFromElement(this._element);
							t(this._element).one(G.TRANSITION_END, function () {
									t(r._element).removeClass(st).addClass(ot).addClass(rt), r._element.style[s] = "", r.setTransitioning(!1), t(r._element).trigger(it.SHOWN)
								}).emulateTransitionEnd(c),
								this._element.style[s] = this._element[a] + "px"
						}
					}
				}, n.hide = function () {
					var e = this;
					if (!this._isTransitioning && t(this._element).hasClass(rt)) {
						var n = t.Event(it.HIDE);
						if (t(this._element).trigger(n), !n.isDefaultPrevented()) {
							var i = this._getDimension();
							this._element.style[i] = this._element.getBoundingClientRect()[i] + "px", G.reflow(this._element), t(this._element).addClass(st).removeClass(ot).removeClass(rt);
							var r = this._triggerArray.length;
							if (0 < r)
								for (var o = 0; o < r; o++) {
									var s = this._triggerArray[o],
										a = G.getSelectorFromElement(s);
									null !== a && (t([].slice.call(document.querySelectorAll(a))).hasClass(rt) || t(s).addClass(at).attr("aria-expanded", !1))
								}
							this.setTransitioning(!0), this._element.style[i] = "";
							var c = G.getTransitionDurationFromElement(this._element);
							t(this._element).one(G.TRANSITION_END, function () {
								e.setTransitioning(!1), t(e._element).removeClass(st).addClass(ot).trigger(it.HIDDEN)
							}).emulateTransitionEnd(c)
						}
					}
				}, n.setTransitioning = function (e) {
					this._isTransitioning = e
				}, n.dispose = function () {
					t.removeData(this._element, Ke), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
				}, n._getConfig = function (e) {
					return (e = o({}, tt, {}, e)).toggle = Boolean(e.toggle), G.typeCheckConfig(Xe, e, nt), e
				}, n._getDimension = function () {
					return t(this._element).hasClass(ct) ? ct : lt
				}, n._getParent = function () {
					var n, i = this;
					G.isElement(this._config.parent) ? (n = this._config.parent, "undefined" != typeof this._config.parent.jquery && (n = this._config.parent[0])) : n = document.querySelector(this._config.parent);
					var r = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
						o = [].slice.call(n.querySelectorAll(r));
					return t(o).each(function (t, n) {
						i._addAriaAndCollapsedClass(e._getTargetFromElement(n), [n])
					}), n
				}, n._addAriaAndCollapsedClass = function (e, n) {
					var i = t(e).hasClass(rt);
					n.length && t(n).toggleClass(at, !i).attr("aria-expanded", i)
				}, e._getTargetFromElement = function (e) {
					var t = G.getSelectorFromElement(e);
					return t ? document.querySelector(t) : null
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this),
							r = i.data(Ke),
							s = o({}, tt, {}, i.data(), {}, "object" == typeof n && n ? n : {});
						if (!r && s.toggle && /show|hide/.test(n) && (s.toggle = !1), r || (r = new e(this, s), i.data(Ke, r)), "string" == typeof n) {
							if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
							r[n]()
						}
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return tt
					}
				}]), e
			}();
		t(document).on(it.CLICK_DATA_API, ut, function (e) {
			"A" === e.currentTarget.tagName && e.preventDefault();
			var n = t(this),
				i = G.getSelectorFromElement(this),
				r = [].slice.call(document.querySelectorAll(i));
			t(r).each(function () {
				var e = t(this),
					i = e.data(Ke) ? "toggle" : n.data();
				pt._jQueryInterface.call(e, i)
			})
		}), t.fn[Xe] = pt._jQueryInterface, t.fn[Xe].Constructor = pt, t.fn[Xe].noConflict = function () {
			return t.fn[Xe] = et, pt._jQueryInterface
		};
		var ft = "undefined" != typeof window && "undefined" != typeof document && "undefined" != typeof navigator,
			ht = function () {
				for (var e = ["Edge", "Trident", "Firefox"], t = 0; t < e.length; t += 1)
					if (ft && 0 <= navigator.userAgent.indexOf(e[t])) return 1;
				return 0
			}(),
			mt = ft && window.Promise ? function (e) {
				var t = !1;
				return function () {
					t || (t = !0, window.Promise.resolve().then(function () {
						t = !1, e()
					}))
				}
			} : function (e) {
				var t = !1;
				return function () {
					t || (t = !0, setTimeout(function () {
						t = !1, e()
					}, ht))
				}
			},
			gt = ft && !(!window.MSInputMethodContext || !document.documentMode),
			vt = ft && /MSIE 10/.test(navigator.userAgent),
			yt = function (e, t, n) {
				return t && b(e.prototype, t), n && b(e, n), e
			},
			At = Object.assign || function (e) {
				for (var t = 1; t < arguments.length; t++) {
					var n = arguments[t];
					for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
				}
				return e
			},
			bt = ft && /Firefox/i.test(navigator.userAgent),
			wt = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
			St = wt.slice(3),
			Ct = "flip",
			Tt = "clockwise",
			xt = "counterclockwise",
			kt = {
				placement: "bottom",
				positionFixed: !1,
				eventsEnabled: !0,
				removeOnDestroy: !1,
				onCreate: function () {},
				onUpdate: function () {},
				modifiers: {
					shift: {
						order: 100,
						enabled: !0,
						fn: function (e) {
							var t = e.placement,
								n = t.split("-")[0],
								i = t.split("-")[1];
							if (i) {
								var r = e.offsets,
									o = r.reference,
									s = r.popper,
									a = -1 !== ["bottom", "top"].indexOf(n),
									c = a ? "left" : "top",
									l = a ? "width" : "height",
									d = {
										start: w({}, c, o[c]),
										end: w({}, c, o[c] + o[l] - s[l])
									};
								e.offsets.popper = At({}, s, d[i])
							}
							return e
						}
					},
					offset: {
						order: 200,
						enabled: !0,
						fn: function (e, t) {
							var n = t.offset,
								i = e.placement,
								r = e.offsets,
								o = r.popper,
								s = r.reference,
								a = i.split("-")[0],
								c = void 0;
							return c = J(+n) ? [+n, 0] : z(n, o, s, a), "left" === a ? (o.top += c[0], o.left -= c[1]) : "right" === a ? (o.top += c[0], o.left += c[1]) : "top" === a ? (o.left += c[0], o.top -= c[1]) : "bottom" === a && (o.left += c[0], o.top += c[1]), e.popper = o, e
						},
						offset: 0
					},
					preventOverflow: {
						order: 300,
						enabled: !0,
						fn: function (e, t) {
							var n = t.boundariesElement || f(e.instance.popper);
							e.instance.reference === n && (n = f(n));
							var i = L("transform"),
								r = e.instance.popper.style,
								o = r.top,
								s = r.left,
								a = r[i];
							r.top = "", r.left = "", r[i] = "";
							var c = k(e.instance.popper, e.instance.reference, t.padding, n, e.positionFixed);
							r.top = o, r.left = s, r[i] = a, t.boundaries = c;
							var l = t.priority,
								d = e.offsets.popper,
								u = {
									primary: function (e) {
										var n = d[e];
										return d[e] < c[e] && !t.escapeWithReference && (n = Math.max(d[e], c[e])), w({}, e, n)
									},
									secondary: function (e) {
										var n = "right" === e ? "left" : "top",
											i = d[n];
										return d[e] > c[e] && !t.escapeWithReference && (i = Math.min(d[n], c[e] - ("right" === e ? d.width : d.height))), w({}, n, i)
									}
								};
							return l.forEach(function (e) {
								var t = -1 !== ["left", "top"].indexOf(e) ? "primary" : "secondary";
								d = At({}, d, u[t](e))
							}), e.offsets.popper = d, e
						},
						priority: ["left", "right", "top", "bottom"],
						padding: 5,
						boundariesElement: "scrollParent"
					},
					keepTogether: {
						order: 400,
						enabled: !0,
						fn: function (e) {
							var t = e.offsets,
								n = t.popper,
								i = t.reference,
								r = e.placement.split("-")[0],
								o = Math.floor,
								s = -1 !== ["top", "bottom"].indexOf(r),
								a = s ? "right" : "bottom",
								c = s ? "left" : "top",
								l = s ? "width" : "height";
							return n[a] < o(i[c]) && (e.offsets.popper[c] = o(i[c]) - n[l]), n[c] > o(i[a]) && (e.offsets.popper[c] = o(i[a])), e
						}
					},
					arrow: {
						order: 500,
						enabled: !0,
						fn: function (e, t) {
							var n;
							if (!B(e.instance.modifiers, "arrow", "keepTogether")) return e;
							var i = t.element;
							if ("string" == typeof i) {
								if (!(i = e.instance.popper.querySelector(i))) return e
							} else if (!e.instance.popper.contains(i)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
							var r = e.placement.split("-")[0],
								o = e.offsets,
								s = o.popper,
								a = o.reference,
								l = -1 !== ["left", "right"].indexOf(r),
								d = l ? "height" : "width",
								u = l ? "Top" : "Left",
								p = u.toLowerCase(),
								f = l ? "left" : "top",
								h = l ? "bottom" : "right",
								m = P(i)[d];
							a[h] - m < s[p] && (e.offsets.popper[p] -= s[p] - (a[h] - m)), a[p] + m > s[h] && (e.offsets.popper[p] += a[p] + m - s[h]), e.offsets.popper = S(e.offsets.popper);
							var g = a[p] + a[d] / 2 - m / 2,
								v = c(e.instance.popper),
								y = parseFloat(v["margin" + u], 10),
								A = parseFloat(v["border" + u + "Width"], 10),
								b = g - e.offsets.popper[p] - y - A;
							return b = Math.max(Math.min(s[d] - m, b), 0), e.arrowElement = i, e.offsets.arrow = (w(n = {}, p, Math.round(b)), w(n, f, ""), n), e
						},
						element: "[x-arrow]"
					},
					flip: {
						order: 600,
						enabled: !0,
						fn: function (e, t) {
							if (O(e.instance.modifiers, "inner")) return e;
							if (e.flipped && e.placement === e.originalPlacement) return e;
							var n = k(e.instance.popper, e.instance.reference, t.padding, t.boundariesElement, e.positionFixed),
								i = e.placement.split("-")[0],
								r = D(i),
								o = e.placement.split("-")[1] || "",
								s = [];
							switch (t.behavior) {
								case Ct:
									s = [i, r];
									break;
								case Tt:
									s = q(i);
									break;
								case xt:
									s = q(i, !0);
									break;
								default:
									s = t.behavior
							}
							return s.forEach(function (a, c) {
								if (i !== a || s.length === c + 1) return e;
								i = e.placement.split("-")[0], r = D(i);
								var l = e.offsets.popper,
									d = e.offsets.reference,
									u = Math.floor,
									p = "left" === i && u(l.right) > u(d.left) || "right" === i && u(l.left) < u(d.right) || "top" === i && u(l.bottom) > u(d.top) || "bottom" === i && u(l.top) < u(d.bottom),
									f = u(l.left) < u(n.left),
									h = u(l.right) > u(n.right),
									m = u(l.top) < u(n.top),
									g = u(l.bottom) > u(n.bottom),
									v = "left" === i && f || "right" === i && h || "top" === i && m || "bottom" === i && g,
									y = -1 !== ["top", "bottom"].indexOf(i),
									A = !!t.flipVariations && (y && "start" === o && f || y && "end" === o && h || !y && "start" === o && m || !y && "end" === o && g),
									b = !!t.flipVariationsByContent && (y && "start" === o && h || y && "end" === o && f || !y && "start" === o && g || !y && "end" === o && m),
									w = A || b;
								(p || v || w) && (e.flipped = !0, (p || v) && (i = s[c + 1]), w && (o = "end" === o ? "start" : "start" === o ? "end" : o), e.placement = i + (o ? "-" + o : ""), e.offsets.popper = At({}, e.offsets.popper, $(e.instance.popper, e.offsets.reference, e.placement)), e = I(e.instance.modifiers, e, "flip"))
							}), e
						},
						behavior: "flip",
						padding: 5,
						boundariesElement: "viewport",
						flipVariations: !1,
						flipVariationsByContent: !1
					},
					inner: {
						order: 700,
						enabled: !1,
						fn: function (e) {
							var t = e.placement,
								n = t.split("-")[0],
								i = e.offsets,
								r = i.popper,
								o = i.reference,
								s = -1 !== ["left", "right"].indexOf(n),
								a = -1 === ["top", "left"].indexOf(n);
							return r[s ? "left" : "top"] = o[n] - (a ? r[s ? "width" : "height"] : 0), e.placement = D(t), e.offsets.popper = S(r), e
						}
					},
					hide: {
						order: 800,
						enabled: !0,
						fn: function (e) {
							if (!B(e.instance.modifiers, "hide", "preventOverflow")) return e;
							var t = e.offsets.reference,
								n = R(e.instance.modifiers, function (e) {
									return "preventOverflow" === e.name
								}).boundaries;
							if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
								if (!0 === e.hide) return e;
								e.hide = !0, e.attributes["x-out-of-boundaries"] = ""
							} else {
								if (!1 === e.hide) return e;
								e.hide = !1, e.attributes["x-out-of-boundaries"] = !1
							}
							return e
						}
					},
					computeStyle: {
						order: 850,
						enabled: !0,
						fn: function (e, t) {
							var n = t.x,
								i = t.y,
								r = e.offsets.popper,
								o = R(e.instance.modifiers, function (e) {
									return "applyStyle" === e.name
								}).gpuAcceleration;
							void 0 !== o && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
							var s = void 0 !== o ? o : t.gpuAcceleration,
								a = f(e.instance.popper),
								c = C(a),
								l = {
									position: r.position
								},
								d = F(e, window.devicePixelRatio < 2 || !bt),
								u = "bottom" === n ? "top" : "bottom",
								p = "right" === i ? "left" : "right",
								h = L("transform"),
								m = void 0,
								g = void 0;
							if (g = "bottom" == u ? "HTML" === a.nodeName ? -a.clientHeight + d.bottom : -c.height + d.bottom : d.top, m = "right" == p ? "HTML" === a.nodeName ? -a.clientWidth + d.right : -c.width + d.right : d.left, s && h) l[h] = "translate3d(" + m + "px, " + g + "px, 0)", l[u] = 0, l[p] = 0, l.willChange = "transform";
							else {
								var v = "bottom" == u ? -1 : 1,
									y = "right" == p ? -1 : 1;
								l[u] = g * v, l[p] = m * y, l.willChange = u + ", " + p
							}
							var A = {
								"x-placement": e.placement
							};
							return e.attributes = At({}, A, e.attributes), e.styles = At({}, l, e.styles), e.arrowStyles = At({}, e.offsets.arrow, e.arrowStyles), e
						},
						gpuAcceleration: !0,
						x: "bottom",
						y: "right"
					},
					applyStyle: {
						order: 900,
						enabled: !0,
						fn: function (e) {
							return H(e.instance.popper, e.styles), t = e.instance.popper, n = e.attributes, Object.keys(n).forEach(function (e) {
								!1 !== n[e] ? t.setAttribute(e, n[e]) : t.removeAttribute(e)
							}), e.arrowElement && Object.keys(e.arrowStyles).length && H(e.arrowElement, e.arrowStyles), e;
							var t, n
						},
						onLoad: function (e, t, n, i, r) {
							var o = E(r, t, e, n.positionFixed),
								s = _(n.placement, o, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
							return t.setAttribute("x-placement", s), H(t, {
								position: n.positionFixed ? "fixed" : "absolute"
							}), n
						},
						gpuAcceleration: void 0
					}
				}
			},
			_t = (yt(W, [{
				key: "update",
				value: function () {
					return function () {
						if (!this.state.isDestroyed) {
							var e = {
								instance: this,
								styles: {},
								arrowStyles: {},
								attributes: {},
								flipped: !1,
								offsets: {}
							};
							e.offsets.reference = E(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = _(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = $(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = I(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e))
						}
					}.call(this)
				}
			}, {
				key: "destroy",
				value: function () {
					return function () {
						return this.state.isDestroyed = !0, O(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[L("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
					}.call(this)
				}
			}, {
				key: "enableEventListeners",
				value: function () {
					return function () {
						this.state.eventsEnabled || (this.state = j(this.reference, this.options, this.state, this.scheduleUpdate))
					}.call(this)
				}
			}, {
				key: "disableEventListeners",
				value: function () {
					return N.call(this)
				}
			}]), W);
		_t.Utils = ("undefined" != typeof window ? window : global).PopperUtils, _t.placements = wt, _t.Defaults = kt;
		var Et = "dropdown",
			Pt = "bs.dropdown",
			Dt = "." + Pt,
			$t = ".data-api",
			Rt = t.fn[Et],
			It = new RegExp("38|40|27"),
			Ot = {
				HIDE: "hide" + Dt,
				HIDDEN: "hidden" + Dt,
				SHOW: "show" + Dt,
				SHOWN: "shown" + Dt,
				CLICK: "click" + Dt,
				CLICK_DATA_API: "click" + Dt + $t,
				KEYDOWN_DATA_API: "keydown" + Dt + $t,
				KEYUP_DATA_API: "keyup" + Dt + $t
			},
			Lt = "disabled",
			Mt = "show",
			jt = "dropup",
			Nt = "dropright",
			Jt = "dropleft",
			Ht = "dropdown-menu-right",
			Ft = "position-static",
			Bt = '[data-toggle="dropdown"]',
			qt = ".dropdown form",
			zt = ".dropdown-menu",
			Wt = ".navbar-nav",
			Ut = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
			Vt = "top-start",
			Gt = "top-end",
			Qt = "bottom-start",
			Yt = "bottom-end",
			Xt = "right-start",
			Kt = "left-start",
			Zt = {
				offset: 0,
				flip: !0,
				boundary: "scrollParent",
				reference: "toggle",
				display: "dynamic",
				popperConfig: null
			},
			en = {
				offset: "(number|string|function)",
				flip: "boolean",
				boundary: "(string|element)",
				reference: "(string|element)",
				display: "string",
				popperConfig: "(null|object)"
			},
			tn = function () {
				function e(e, t) {
					this._element = e, this._popper = null, this._config = this._getConfig(t), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
				}
				var n = e.prototype;
				return n.toggle = function () {
					if (!this._element.disabled && !t(this._element).hasClass(Lt)) {
						var n = t(this._menu).hasClass(Mt);
						e._clearMenus(), n || this.show(!0)
					}
				}, n.show = function (n) {
					if (void 0 === n && (n = !1), !(this._element.disabled || t(this._element).hasClass(Lt) || t(this._menu).hasClass(Mt))) {
						var i = {
								relatedTarget: this._element
							},
							r = t.Event(Ot.SHOW, i),
							o = e._getParentFromElement(this._element);
						if (t(o).trigger(r), !r.isDefaultPrevented()) {
							if (!this._inNavbar && n) {
								if (void 0 === _t) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
								var s = this._element;
								"parent" === this._config.reference ? s = o : G.isElement(this._config.reference) && (s = this._config.reference, "undefined" != typeof this._config.reference.jquery && (s = this._config.reference[0])), "scrollParent" !== this._config.boundary && t(o).addClass(Ft), this._popper = new _t(s, this._menu, this._getPopperConfig())
							}
							"ontouchstart" in document.documentElement && 0 === t(o).closest(Wt).length && t(document.body).children().on("mouseover", null, t.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), t(this._menu).toggleClass(Mt), t(o).toggleClass(Mt).trigger(t.Event(Ot.SHOWN, i))
						}
					}
				}, n.hide = function () {
					if (!this._element.disabled && !t(this._element).hasClass(Lt) && t(this._menu).hasClass(Mt)) {
						var n = {
								relatedTarget: this._element
							},
							i = t.Event(Ot.HIDE, n),
							r = e._getParentFromElement(this._element);
						t(r).trigger(i), i.isDefaultPrevented() || (this._popper && this._popper.destroy(), t(this._menu).toggleClass(Mt), t(r).toggleClass(Mt).trigger(t.Event(Ot.HIDDEN, n)))
					}
				}, n.dispose = function () {
					t.removeData(this._element, Pt), t(this._element).off(Dt), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null)
				}, n.update = function () {
					this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
				}, n._addEventListeners = function () {
					var e = this;
					t(this._element).on(Ot.CLICK, function (t) {
						t.preventDefault(), t.stopPropagation(), e.toggle()
					})
				}, n._getConfig = function (e) {
					return e = o({}, this.constructor.Default, {}, t(this._element).data(), {}, e), G.typeCheckConfig(Et, e, this.constructor.DefaultType), e
				}, n._getMenuElement = function () {
					if (!this._menu) {
						var t = e._getParentFromElement(this._element);
						t && (this._menu = t.querySelector(zt))
					}
					return this._menu
				}, n._getPlacement = function () {
					var e = t(this._element.parentNode),
						n = Qt;
					return e.hasClass(jt) ? (n = Vt, t(this._menu).hasClass(Ht) && (n = Gt)) : e.hasClass(Nt) ? n = Xt : e.hasClass(Jt) ? n = Kt : t(this._menu).hasClass(Ht) && (n = Yt), n
				}, n._detectNavbar = function () {
					return 0 < t(this._element).closest(".navbar").length
				}, n._getOffset = function () {
					var e = this,
						t = {};
					return "function" == typeof this._config.offset ? t.fn = function (t) {
						return t.offsets = o({}, t.offsets, {}, e._config.offset(t.offsets, e._element) || {}), t
					} : t.offset = this._config.offset, t
				}, n._getPopperConfig = function () {
					var e = {
						placement: this._getPlacement(),
						modifiers: {
							offset: this._getOffset(),
							flip: {
								enabled: this._config.flip
							},
							preventOverflow: {
								boundariesElement: this._config.boundary
							}
						}
					};
					return "static" === this._config.display && (e.modifiers.applyStyle = {
						enabled: !1
					}), o({}, e, {}, this._config.popperConfig)
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this).data(Pt);
						if (i || (i = new e(this, "object" == typeof n ? n : null), t(this).data(Pt, i)), "string" == typeof n) {
							if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
							i[n]()
						}
					})
				}, e._clearMenus = function (n) {
					if (!n || 3 !== n.which && ("keyup" !== n.type || 9 === n.which))
						for (var i = [].slice.call(document.querySelectorAll(Bt)), r = 0, o = i.length; r < o; r++) {
							var s = e._getParentFromElement(i[r]),
								a = t(i[r]).data(Pt),
								c = {
									relatedTarget: i[r]
								};
							if (n && "click" === n.type && (c.clickEvent = n), a) {
								var l = a._menu;
								if (t(s).hasClass(Mt) && !(n && ("click" === n.type && /input|textarea/i.test(n.target.tagName) || "keyup" === n.type && 9 === n.which) && t.contains(s, n.target))) {
									var d = t.Event(Ot.HIDE, c);
									t(s).trigger(d), d.isDefaultPrevented() || ("ontouchstart" in document.documentElement && t(document.body).children().off("mouseover", null, t.noop), i[r].setAttribute("aria-expanded", "false"), a._popper && a._popper.destroy(), t(l).removeClass(Mt), t(s).removeClass(Mt).trigger(t.Event(Ot.HIDDEN, c)))
								}
							}
						}
				}, e._getParentFromElement = function (e) {
					var t, n = G.getSelectorFromElement(e);
					return n && (t = document.querySelector(n)), t || e.parentNode
				}, e._dataApiKeydownHandler = function (n) {
					if ((/input|textarea/i.test(n.target.tagName) ? !(32 === n.which || 27 !== n.which && (40 !== n.which && 38 !== n.which || t(n.target).closest(zt).length)) : It.test(n.which)) && (n.preventDefault(), n.stopPropagation(), !this.disabled && !t(this).hasClass(Lt))) {
						var i = e._getParentFromElement(this),
							r = t(i).hasClass(Mt);
						if (r || 27 !== n.which)
							if (r && (!r || 27 !== n.which && 32 !== n.which)) {
								var o = [].slice.call(i.querySelectorAll(Ut)).filter(function (e) {
									return t(e).is(":visible")
								});
								if (0 !== o.length) {
									var s = o.indexOf(n.target);
									38 === n.which && 0 < s && s--, 40 === n.which && s < o.length - 1 && s++, s < 0 && (s = 0), o[s].focus()
								}
							} else {
								if (27 === n.which) {
									var a = i.querySelector(Bt);
									t(a).trigger("focus")
								}
								t(this).trigger("click")
							}
					}
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return Zt
					}
				}, {
					key: "DefaultType",
					get: function () {
						return en
					}
				}]), e
			}();
		t(document).on(Ot.KEYDOWN_DATA_API, Bt, tn._dataApiKeydownHandler).on(Ot.KEYDOWN_DATA_API, zt, tn._dataApiKeydownHandler).on(Ot.CLICK_DATA_API + " " + Ot.KEYUP_DATA_API, tn._clearMenus).on(Ot.CLICK_DATA_API, Bt, function (e) {
			e.preventDefault(), e.stopPropagation(), tn._jQueryInterface.call(t(this), "toggle")
		}).on(Ot.CLICK_DATA_API, qt, function (e) {
			e.stopPropagation()
		}), t.fn[Et] = tn._jQueryInterface, t.fn[Et].Constructor = tn, t.fn[Et].noConflict = function () {
			return t.fn[Et] = Rt, tn._jQueryInterface
		};
		var nn = "modal",
			rn = "bs.modal",
			on = "." + rn,
			sn = t.fn[nn],
			an = {
				backdrop: !0,
				keyboard: !0,
				focus: !0,
				show: !0
			},
			cn = {
				backdrop: "(boolean|string)",
				keyboard: "boolean",
				focus: "boolean",
				show: "boolean"
			},
			ln = {
				HIDE: "hide" + on,
				HIDE_PREVENTED: "hidePrevented" + on,
				HIDDEN: "hidden" + on,
				SHOW: "show" + on,
				SHOWN: "shown" + on,
				FOCUSIN: "focusin" + on,
				RESIZE: "resize" + on,
				CLICK_DISMISS: "click.dismiss" + on,
				KEYDOWN_DISMISS: "keydown.dismiss" + on,
				MOUSEUP_DISMISS: "mouseup.dismiss" + on,
				MOUSEDOWN_DISMISS: "mousedown.dismiss" + on,
				CLICK_DATA_API: "click" + on + ".data-api"
			},
			dn = "modal-dialog-scrollable",
			un = "modal-scrollbar-measure",
			pn = "modal-backdrop",
			fn = "modal-open",
			hn = "fade",
			mn = "show",
			gn = "modal-static",
			vn = ".modal-dialog",
			yn = ".modal-body",
			An = '[data-toggle="modal"]',
			bn = '[data-dismiss="modal"]',
			wn = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
			Sn = ".sticky-top",
			Cn = function () {
				function e(e, t) {
					this._config = this._getConfig(t), this._element = e, this._dialog = e.querySelector(vn), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0
				}
				var n = e.prototype;
				return n.toggle = function (e) {
					return this._isShown ? this.hide() : this.show(e)
				}, n.show = function (e) {
					var n = this;
					if (!this._isShown && !this._isTransitioning) {
						t(this._element).hasClass(hn) && (this._isTransitioning = !0);
						var i = t.Event(ln.SHOW, {
							relatedTarget: e
						});
						t(this._element).trigger(i), this._isShown || i.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), t(this._element).on(ln.CLICK_DISMISS, bn, function (e) {
							return n.hide(e)
						}), t(this._dialog).on(ln.MOUSEDOWN_DISMISS, function () {
							t(n._element).one(ln.MOUSEUP_DISMISS, function (e) {
								t(e.target).is(n._element) && (n._ignoreBackdropClick = !0)
							})
						}), this._showBackdrop(function () {
							return n._showElement(e)
						}))
					}
				}, n.hide = function (e) {
					var n = this;
					if (e && e.preventDefault(), this._isShown && !this._isTransitioning) {
						var i = t.Event(ln.HIDE);
						if (t(this._element).trigger(i), this._isShown && !i.isDefaultPrevented()) {
							this._isShown = !1;
							var r = t(this._element).hasClass(hn);
							if (r && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), t(document).off(ln.FOCUSIN), t(this._element).removeClass(mn), t(this._element).off(ln.CLICK_DISMISS), t(this._dialog).off(ln.MOUSEDOWN_DISMISS), r) {
								var o = G.getTransitionDurationFromElement(this._element);
								t(this._element).one(G.TRANSITION_END, function (e) {
									return n._hideModal(e)
								}).emulateTransitionEnd(o)
							} else this._hideModal()
						}
					}
				}, n.dispose = function () {
					[window, this._element, this._dialog].forEach(function (e) {
						return t(e).off(on)
					}), t(document).off(ln.FOCUSIN), t.removeData(this._element, rn), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null
				}, n.handleUpdate = function () {
					this._adjustDialog()
				}, n._getConfig = function (e) {
					return e = o({}, an, {}, e), G.typeCheckConfig(nn, e, cn), e
				}, n._triggerBackdropTransition = function () {
					var e = this;
					if ("static" === this._config.backdrop) {
						var n = t.Event(ln.HIDE_PREVENTED);
						if (t(this._element).trigger(n), n.defaultPrevented) return;
						this._element.classList.add(gn);
						var i = G.getTransitionDurationFromElement(this._element);
						t(this._element).one(G.TRANSITION_END, function () {
							e._element.classList.remove(gn)
						}).emulateTransitionEnd(i), this._element.focus()
					} else this.hide()
				}, n._showElement = function (e) {
					function n() {
						i._config.focus && i._element.focus(), i._isTransitioning = !1, t(i._element).trigger(s)
					}
					var i = this,
						r = t(this._element).hasClass(hn),
						o = this._dialog ? this._dialog.querySelector(yn) : null;
					this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), t(this._dialog).hasClass(dn) && o ? o.scrollTop = 0 : this._element.scrollTop = 0, r && G.reflow(this._element), t(this._element).addClass(mn), this._config.focus && this._enforceFocus();
					var s = t.Event(ln.SHOWN, {
						relatedTarget: e
					});
					if (r) {
						var a = G.getTransitionDurationFromElement(this._dialog);
						t(this._dialog).one(G.TRANSITION_END, n).emulateTransitionEnd(a)
					} else n()
				}, n._enforceFocus = function () {
					var e = this;
					t(document).off(ln.FOCUSIN).on(ln.FOCUSIN, function (n) {
						document !== n.target && e._element !== n.target && 0 === t(e._element).has(n.target).length && e._element.focus()
					})
				}, n._setEscapeEvent = function () {
					var e = this;
					this._isShown && this._config.keyboard ? t(this._element).on(ln.KEYDOWN_DISMISS, function (t) {
						27 === t.which && e._triggerBackdropTransition()
					}) : this._isShown || t(this._element).off(ln.KEYDOWN_DISMISS)
				}, n._setResizeEvent = function () {
					var e = this;
					this._isShown ? t(window).on(ln.RESIZE, function (t) {
						return e.handleUpdate(t)
					}) : t(window).off(ln.RESIZE)
				}, n._hideModal = function () {
					var e = this;
					this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._isTransitioning = !1, this._showBackdrop(function () {
						t(document.body).removeClass(fn), e._resetAdjustments(), e._resetScrollbar(), t(e._element).trigger(ln.HIDDEN)
					})
				}, n._removeBackdrop = function () {
					this._backdrop && (t(this._backdrop).remove(), this._backdrop = null)
				}, n._showBackdrop = function (e) {
					var n = this,
						i = t(this._element).hasClass(hn) ? hn : "";
					if (this._isShown && this._config.backdrop) {
						if (this._backdrop = document.createElement("div"), this._backdrop.className = pn, i && this._backdrop.classList.add(i), t(this._backdrop).appendTo(document.body), t(this._element).on(ln.CLICK_DISMISS, function (e) {
								n._ignoreBackdropClick ? n._ignoreBackdropClick = !1 : e.target === e.currentTarget && n._triggerBackdropTransition()
							}), i && G.reflow(this._backdrop), t(this._backdrop).addClass(mn), !e) return;
						if (!i) return void e();
						var r = G.getTransitionDurationFromElement(this._backdrop);
						t(this._backdrop).one(G.TRANSITION_END, e).emulateTransitionEnd(r)
					} else if (!this._isShown && this._backdrop) {
						t(this._backdrop).removeClass(mn);
						var o = function () {
							n._removeBackdrop(), e && e()
						};
						if (t(this._element).hasClass(hn)) {
							var s = G.getTransitionDurationFromElement(this._backdrop);
							t(this._backdrop).one(G.TRANSITION_END, o).emulateTransitionEnd(s)
						} else o()
					} else e && e()
				}, n._adjustDialog = function () {
					var e = this._element.scrollHeight > document.documentElement.clientHeight;
					!this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
				}, n._resetAdjustments = function () {
					this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
				}, n._checkScrollbar = function () {
					var e = document.body.getBoundingClientRect();
					this._isBodyOverflowing = e.left + e.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
				}, n._setScrollbar = function () {
					var e = this;
					if (this._isBodyOverflowing) {
						var n = [].slice.call(document.querySelectorAll(wn)),
							i = [].slice.call(document.querySelectorAll(Sn));
						t(n).each(function (n, i) {
							var r = i.style.paddingRight,
								o = t(i).css("padding-right");
							t(i).data("padding-right", r).css("padding-right", parseFloat(o) + e._scrollbarWidth + "px")
						}), t(i).each(function (n, i) {
							var r = i.style.marginRight,
								o = t(i).css("margin-right");
							t(i).data("margin-right", r).css("margin-right", parseFloat(o) - e._scrollbarWidth + "px")
						});
						var r = document.body.style.paddingRight,
							o = t(document.body).css("padding-right");
						t(document.body).data("padding-right", r).css("padding-right", parseFloat(o) + this._scrollbarWidth + "px")
					}
					t(document.body).addClass(fn)
				}, n._resetScrollbar = function () {
					var e = [].slice.call(document.querySelectorAll(wn));
					t(e).each(function (e, n) {
						var i = t(n).data("padding-right");
						t(n).removeData("padding-right"), n.style.paddingRight = i || ""
					});
					var n = [].slice.call(document.querySelectorAll("" + Sn));
					t(n).each(function (e, n) {
						var i = t(n).data("margin-right");
						void 0 !== i && t(n).css("margin-right", i).removeData("margin-right")
					});
					var i = t(document.body).data("padding-right");
					t(document.body).removeData("padding-right"), document.body.style.paddingRight = i || ""
				}, n._getScrollbarWidth = function () {
					var e = document.createElement("div");
					e.className = un, document.body.appendChild(e);
					var t = e.getBoundingClientRect().width - e.clientWidth;
					return document.body.removeChild(e), t
				}, e._jQueryInterface = function (n, i) {
					return this.each(function () {
						var r = t(this).data(rn),
							s = o({}, an, {}, t(this).data(), {}, "object" == typeof n && n ? n : {});
						if (r || (r = new e(this, s), t(this).data(rn, r)), "string" == typeof n) {
							if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
							r[n](i)
						} else s.show && r.show(i)
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return an
					}
				}]), e
			}();
		t(document).on(ln.CLICK_DATA_API, An, function (e) {
			var n, i = this,
				r = G.getSelectorFromElement(this);
			r && (n = document.querySelector(r));
			var s = t(n).data(rn) ? "toggle" : o({}, t(n).data(), {}, t(this).data());
			"A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
			var a = t(n).one(ln.SHOW, function (e) {
				e.isDefaultPrevented() || a.one(ln.HIDDEN, function () {
					t(i).is(":visible") && i.focus()
				})
			});
			Cn._jQueryInterface.call(t(n), s, this)
		}), t.fn[nn] = Cn._jQueryInterface, t.fn[nn].Constructor = Cn, t.fn[nn].noConflict = function () {
			return t.fn[nn] = sn, Cn._jQueryInterface
		};
		var Tn = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
			xn = {
				"*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
				a: ["target", "href", "title", "rel"],
				area: [],
				b: [],
				br: [],
				col: [],
				code: [],
				div: [],
				em: [],
				hr: [],
				h1: [],
				h2: [],
				h3: [],
				h4: [],
				h5: [],
				h6: [],
				i: [],
				img: ["src", "alt", "title", "width", "height"],
				li: [],
				ol: [],
				p: [],
				pre: [],
				s: [],
				small: [],
				span: [],
				sub: [],
				sup: [],
				strong: [],
				u: [],
				ul: []
			},
			kn = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
			_n = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i,
			En = "tooltip",
			Pn = "bs.tooltip",
			Dn = "." + Pn,
			$n = t.fn[En],
			Rn = "bs-tooltip",
			In = new RegExp("(^|\\s)" + Rn + "\\S+", "g"),
			On = ["sanitize", "whiteList", "sanitizeFn"],
			Ln = {
				animation: "boolean",
				template: "string",
				title: "(string|element|function)",
				trigger: "string",
				delay: "(number|object)",
				html: "boolean",
				selector: "(string|boolean)",
				placement: "(string|function)",
				offset: "(number|string|function)",
				container: "(string|element|boolean)",
				fallbackPlacement: "(string|array)",
				boundary: "(string|element)",
				sanitize: "boolean",
				sanitizeFn: "(null|function)",
				whiteList: "object",
				popperConfig: "(null|object)"
			},
			Mn = {
				AUTO: "auto",
				TOP: "top",
				RIGHT: "right",
				BOTTOM: "bottom",
				LEFT: "left"
			},
			jn = {
				animation: !0,
				template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
				trigger: "hover focus",
				title: "",
				delay: 0,
				html: !1,
				selector: !1,
				placement: "top",
				offset: 0,
				container: !1,
				fallbackPlacement: "flip",
				boundary: "scrollParent",
				sanitize: !0,
				sanitizeFn: null,
				whiteList: xn,
				popperConfig: null
			},
			Nn = "show",
			Jn = "out",
			Hn = {
				HIDE: "hide" + Dn,
				HIDDEN: "hidden" + Dn,
				SHOW: "show" + Dn,
				SHOWN: "shown" + Dn,
				INSERTED: "inserted" + Dn,
				CLICK: "click" + Dn,
				FOCUSIN: "focusin" + Dn,
				FOCUSOUT: "focusout" + Dn,
				MOUSEENTER: "mouseenter" + Dn,
				MOUSELEAVE: "mouseleave" + Dn
			},
			Fn = "fade",
			Bn = "show",
			qn = ".tooltip-inner",
			zn = ".arrow",
			Wn = "hover",
			Un = "focus",
			Vn = "click",
			Gn = "manual",
			Qn = function () {
				function e(e, t) {
					if (void 0 === _t) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
					this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = e, this.config = this._getConfig(t), this.tip = null, this._setListeners()
				}
				var n = e.prototype;
				return n.enable = function () {
					this._isEnabled = !0
				}, n.disable = function () {
					this._isEnabled = !1
				}, n.toggleEnabled = function () {
					this._isEnabled = !this._isEnabled
				}, n.toggle = function (e) {
					if (this._isEnabled)
						if (e) {
							var n = this.constructor.DATA_KEY,
								i = t(e.currentTarget).data(n);
							i || (i = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(n, i)), i._activeTrigger.click = !i._activeTrigger.click, i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i)
						} else {
							if (t(this.getTipElement()).hasClass(Bn)) return void this._leave(null, this);
							this._enter(null, this)
						}
				}, n.dispose = function () {
					clearTimeout(this._timeout), t.removeData(this.element, this.constructor.DATA_KEY), t(this.element).off(this.constructor.EVENT_KEY), t(this.element).closest(".modal").off("hide.bs.modal", this._hideModalHandler), this.tip && t(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
				}, n.show = function () {
					var e = this;
					if ("none" === t(this.element).css("display")) throw new Error("Please use show on visible elements");
					var n = t.Event(this.constructor.Event.SHOW);
					if (this.isWithContent() && this._isEnabled) {
						t(this.element).trigger(n);
						var i = G.findShadowRoot(this.element),
							r = t.contains(null !== i ? i : this.element.ownerDocument.documentElement, this.element);
						if (n.isDefaultPrevented() || !r) return;
						var o = this.getTipElement(),
							s = G.getUID(this.constructor.NAME);
						o.setAttribute("id", s), this.element.setAttribute("aria-describedby", s), this.setContent(), this.config.animation && t(o).addClass(Fn);
						var a = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement,
							c = this._getAttachment(a);
						this.addAttachmentClass(c);
						var l = this._getContainer();
						t(o).data(this.constructor.DATA_KEY, this), t.contains(this.element.ownerDocument.documentElement, this.tip) || t(o).appendTo(l), t(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new _t(this.element, o, this._getPopperConfig(c)), t(o).addClass(Bn), "ontouchstart" in document.documentElement && t(document.body).children().on("mouseover", null, t.noop);
						var d = function () {
							e.config.animation && e._fixTransition();
							var n = e._hoverState;
							e._hoverState = null, t(e.element).trigger(e.constructor.Event.SHOWN), n === Jn && e._leave(null, e)
						};
						if (t(this.tip).hasClass(Fn)) {
							var u = G.getTransitionDurationFromElement(this.tip);
							t(this.tip).one(G.TRANSITION_END, d).emulateTransitionEnd(u)
						} else d()
					}
				}, n.hide = function (e) {
					function n() {
						i._hoverState !== Nn && r.parentNode && r.parentNode.removeChild(r), i._cleanTipClass(),
							i.element.removeAttribute("aria-describedby"), t(i.element).trigger(i.constructor.Event.HIDDEN), null !== i._popper && i._popper.destroy(), e && e()
					}
					var i = this,
						r = this.getTipElement(),
						o = t.Event(this.constructor.Event.HIDE);
					if (t(this.element).trigger(o), !o.isDefaultPrevented()) {
						if (t(r).removeClass(Bn), "ontouchstart" in document.documentElement && t(document.body).children().off("mouseover", null, t.noop), this._activeTrigger[Vn] = !1, this._activeTrigger[Un] = !1, this._activeTrigger[Wn] = !1, t(this.tip).hasClass(Fn)) {
							var s = G.getTransitionDurationFromElement(r);
							t(r).one(G.TRANSITION_END, n).emulateTransitionEnd(s)
						} else n();
						this._hoverState = ""
					}
				}, n.update = function () {
					null !== this._popper && this._popper.scheduleUpdate()
				}, n.isWithContent = function () {
					return Boolean(this.getTitle())
				}, n.addAttachmentClass = function (e) {
					t(this.getTipElement()).addClass(Rn + "-" + e)
				}, n.getTipElement = function () {
					return this.tip = this.tip || t(this.config.template)[0], this.tip
				}, n.setContent = function () {
					var e = this.getTipElement();
					this.setElementContent(t(e.querySelectorAll(qn)), this.getTitle()), t(e).removeClass(Fn + " " + Bn)
				}, n.setElementContent = function (e, n) {
					"object" != typeof n || !n.nodeType && !n.jquery ? this.config.html ? (this.config.sanitize && (n = U(n, this.config.whiteList, this.config.sanitizeFn)), e.html(n)) : e.text(n) : this.config.html ? t(n).parent().is(e) || e.empty().append(n) : e.text(t(n).text())
				}, n.getTitle = function () {
					var e = this.element.getAttribute("data-original-title");
					return e || ("function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title)
				}, n._getPopperConfig = function (e) {
					var t = this;
					return o({}, {
						placement: e,
						modifiers: {
							offset: this._getOffset(),
							flip: {
								behavior: this.config.fallbackPlacement
							},
							arrow: {
								element: zn
							},
							preventOverflow: {
								boundariesElement: this.config.boundary
							}
						},
						onCreate: function (e) {
							e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
						},
						onUpdate: function (e) {
							return t._handlePopperPlacementChange(e)
						}
					}, {}, this.config.popperConfig)
				}, n._getOffset = function () {
					var e = this,
						t = {};
					return "function" == typeof this.config.offset ? t.fn = function (t) {
						return t.offsets = o({}, t.offsets, {}, e.config.offset(t.offsets, e.element) || {}), t
					} : t.offset = this.config.offset, t
				}, n._getContainer = function () {
					return !1 === this.config.container ? document.body : G.isElement(this.config.container) ? t(this.config.container) : t(document).find(this.config.container)
				}, n._getAttachment = function (e) {
					return Mn[e.toUpperCase()]
				}, n._setListeners = function () {
					var e = this;
					this.config.trigger.split(" ").forEach(function (n) {
						if ("click" === n) t(e.element).on(e.constructor.Event.CLICK, e.config.selector, function (t) {
							return e.toggle(t)
						});
						else if (n !== Gn) {
							var i = n === Wn ? e.constructor.Event.MOUSEENTER : e.constructor.Event.FOCUSIN,
								r = n === Wn ? e.constructor.Event.MOUSELEAVE : e.constructor.Event.FOCUSOUT;
							t(e.element).on(i, e.config.selector, function (t) {
								return e._enter(t)
							}).on(r, e.config.selector, function (t) {
								return e._leave(t)
							})
						}
					}), this._hideModalHandler = function () {
						e.element && e.hide()
					}, t(this.element).closest(".modal").on("hide.bs.modal", this._hideModalHandler), this.config.selector ? this.config = o({}, this.config, {
						trigger: "manual",
						selector: ""
					}) : this._fixTitle()
				}, n._fixTitle = function () {
					var e = typeof this.element.getAttribute("data-original-title");
					!this.element.getAttribute("title") && "string" == e || (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
				}, n._enter = function (e, n) {
					var i = this.constructor.DATA_KEY;
					(n = n || t(e.currentTarget).data(i)) || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusin" === e.type ? Un : Wn] = !0), t(n.getTipElement()).hasClass(Bn) || n._hoverState === Nn ? n._hoverState = Nn : (clearTimeout(n._timeout), n._hoverState = Nn, n.config.delay && n.config.delay.show ? n._timeout = setTimeout(function () {
						n._hoverState === Nn && n.show()
					}, n.config.delay.show) : n.show())
				}, n._leave = function (e, n) {
					var i = this.constructor.DATA_KEY;
					(n = n || t(e.currentTarget).data(i)) || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusout" === e.type ? Un : Wn] = !1), n._isWithActiveTrigger() || (clearTimeout(n._timeout), n._hoverState = Jn, n.config.delay && n.config.delay.hide ? n._timeout = setTimeout(function () {
						n._hoverState === Jn && n.hide()
					}, n.config.delay.hide) : n.hide())
				}, n._isWithActiveTrigger = function () {
					for (var e in this._activeTrigger)
						if (this._activeTrigger[e]) return !0;
					return !1
				}, n._getConfig = function (e) {
					var n = t(this.element).data();
					return Object.keys(n).forEach(function (e) {
						-1 !== On.indexOf(e) && delete n[e]
					}), "number" == typeof (e = o({}, this.constructor.Default, {}, n, {}, "object" == typeof e && e ? e : {})).delay && (e.delay = {
						show: e.delay,
						hide: e.delay
					}), "number" == typeof e.title && (e.title = e.title.toString()), "number" == typeof e.content && (e.content = e.content.toString()), G.typeCheckConfig(En, e, this.constructor.DefaultType), e.sanitize && (e.template = U(e.template, e.whiteList, e.sanitizeFn)), e
				}, n._getDelegateConfig = function () {
					var e = {};
					if (this.config)
						for (var t in this.config) this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
					return e
				}, n._cleanTipClass = function () {
					var e = t(this.getTipElement()),
						n = e.attr("class").match(In);
					null !== n && n.length && e.removeClass(n.join(""))
				}, n._handlePopperPlacementChange = function (e) {
					var t = e.instance;
					this.tip = t.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(e.placement))
				}, n._fixTransition = function () {
					var e = this.getTipElement(),
						n = this.config.animation;
					null === e.getAttribute("x-placement") && (t(e).removeClass(Fn), this.config.animation = !1, this.hide(), this.show(), this.config.animation = n)
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this).data(Pn),
							r = "object" == typeof n && n;
						if ((i || !/dispose|hide/.test(n)) && (i || (i = new e(this, r), t(this).data(Pn, i)), "string" == typeof n)) {
							if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
							i[n]()
						}
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return jn
					}
				}, {
					key: "NAME",
					get: function () {
						return En
					}
				}, {
					key: "DATA_KEY",
					get: function () {
						return Pn
					}
				}, {
					key: "Event",
					get: function () {
						return Hn
					}
				}, {
					key: "EVENT_KEY",
					get: function () {
						return Dn
					}
				}, {
					key: "DefaultType",
					get: function () {
						return Ln
					}
				}]), e
			}();
		t.fn[En] = Qn._jQueryInterface, t.fn[En].Constructor = Qn, t.fn[En].noConflict = function () {
			return t.fn[En] = $n, Qn._jQueryInterface
		};
		var Yn = "popover",
			Xn = "bs.popover",
			Kn = "." + Xn,
			Zn = t.fn[Yn],
			ei = "bs-popover",
			ti = new RegExp("(^|\\s)" + ei + "\\S+", "g"),
			ni = o({}, Qn.Default, {
				placement: "right",
				trigger: "click",
				content: "",
				template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
			}),
			ii = o({}, Qn.DefaultType, {
				content: "(string|element|function)"
			}),
			ri = "fade",
			oi = "show",
			si = ".popover-header",
			ai = ".popover-body",
			ci = {
				HIDE: "hide" + Kn,
				HIDDEN: "hidden" + Kn,
				SHOW: "show" + Kn,
				SHOWN: "shown" + Kn,
				INSERTED: "inserted" + Kn,
				CLICK: "click" + Kn,
				FOCUSIN: "focusin" + Kn,
				FOCUSOUT: "focusout" + Kn,
				MOUSEENTER: "mouseenter" + Kn,
				MOUSELEAVE: "mouseleave" + Kn
			},
			li = function (e) {
				function n() {
					return e.apply(this, arguments) || this
				}! function (e, t) {
					e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t
				}(n, e);
				var r = n.prototype;
				return r.isWithContent = function () {
					return this.getTitle() || this._getContent()
				}, r.addAttachmentClass = function (e) {
					t(this.getTipElement()).addClass(ei + "-" + e)
				}, r.getTipElement = function () {
					return this.tip = this.tip || t(this.config.template)[0], this.tip
				}, r.setContent = function () {
					var e = t(this.getTipElement());
					this.setElementContent(e.find(si), this.getTitle());
					var n = this._getContent();
					"function" == typeof n && (n = n.call(this.element)), this.setElementContent(e.find(ai), n), e.removeClass(ri + " " + oi)
				}, r._getContent = function () {
					return this.element.getAttribute("data-content") || this.config.content
				}, r._cleanTipClass = function () {
					var e = t(this.getTipElement()),
						n = e.attr("class").match(ti);
					null !== n && 0 < n.length && e.removeClass(n.join(""))
				}, n._jQueryInterface = function (e) {
					return this.each(function () {
						var i = t(this).data(Xn),
							r = "object" == typeof e ? e : null;
						if ((i || !/dispose|hide/.test(e)) && (i || (i = new n(this, r), t(this).data(Xn, i)), "string" == typeof e)) {
							if ("undefined" == typeof i[e]) throw new TypeError('No method named "' + e + '"');
							i[e]()
						}
					})
				}, i(n, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return ni
					}
				}, {
					key: "NAME",
					get: function () {
						return Yn
					}
				}, {
					key: "DATA_KEY",
					get: function () {
						return Xn
					}
				}, {
					key: "Event",
					get: function () {
						return ci
					}
				}, {
					key: "EVENT_KEY",
					get: function () {
						return Kn
					}
				}, {
					key: "DefaultType",
					get: function () {
						return ii
					}
				}]), n
			}(Qn);
		t.fn[Yn] = li._jQueryInterface, t.fn[Yn].Constructor = li, t.fn[Yn].noConflict = function () {
			return t.fn[Yn] = Zn, li._jQueryInterface
		};
		var di = "scrollspy",
			ui = "bs.scrollspy",
			pi = "." + ui,
			fi = t.fn[di],
			hi = {
				offset: 10,
				method: "auto",
				target: ""
			},
			mi = {
				offset: "number",
				method: "string",
				target: "(string|element)"
			},
			gi = {
				ACTIVATE: "activate" + pi,
				SCROLL: "scroll" + pi,
				LOAD_DATA_API: "load" + pi + ".data-api"
			},
			vi = "dropdown-item",
			yi = "active",
			Ai = '[data-spy="scroll"]',
			bi = ".nav, .list-group",
			wi = ".nav-link",
			Si = ".nav-item",
			Ci = ".list-group-item",
			Ti = ".dropdown",
			xi = ".dropdown-item",
			ki = ".dropdown-toggle",
			_i = "offset",
			Ei = "position",
			Pi = function () {
				function e(e, n) {
					var i = this;
					this._element = e, this._scrollElement = "BODY" === e.tagName ? window : e, this._config = this._getConfig(n), this._selector = this._config.target + " " + wi + "," + this._config.target + " " + Ci + "," + this._config.target + " " + xi, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, t(this._scrollElement).on(gi.SCROLL, function (e) {
						return i._process(e)
					}), this.refresh(), this._process()
				}
				var n = e.prototype;
				return n.refresh = function () {
					var e = this,
						n = this._scrollElement === this._scrollElement.window ? _i : Ei,
						i = "auto" === this._config.method ? n : this._config.method,
						r = i === Ei ? this._getScrollTop() : 0;
					this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (e) {
						var n, o = G.getSelectorFromElement(e);
						if (o && (n = document.querySelector(o)), n) {
							var s = n.getBoundingClientRect();
							if (s.width || s.height) return [t(n)[i]().top + r, o]
						}
						return null
					}).filter(function (e) {
						return e
					}).sort(function (e, t) {
						return e[0] - t[0]
					}).forEach(function (t) {
						e._offsets.push(t[0]), e._targets.push(t[1])
					})
				}, n.dispose = function () {
					t.removeData(this._element, ui), t(this._scrollElement).off(pi), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
				}, n._getConfig = function (e) {
					if ("string" != typeof (e = o({}, hi, {}, "object" == typeof e && e ? e : {})).target) {
						var n = t(e.target).attr("id");
						n || (n = G.getUID(di), t(e.target).attr("id", n)), e.target = "#" + n
					}
					return G.typeCheckConfig(di, e, mi), e
				}, n._getScrollTop = function () {
					return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
				}, n._getScrollHeight = function () {
					return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
				}, n._getOffsetHeight = function () {
					return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
				}, n._process = function () {
					var e = this._getScrollTop() + this._config.offset,
						t = this._getScrollHeight(),
						n = this._config.offset + t - this._getOffsetHeight();
					if (this._scrollHeight !== t && this.refresh(), n <= e) {
						var i = this._targets[this._targets.length - 1];
						this._activeTarget !== i && this._activate(i)
					} else {
						if (this._activeTarget && e < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
						for (var r = this._offsets.length; r--;) this._activeTarget !== this._targets[r] && e >= this._offsets[r] && ("undefined" == typeof this._offsets[r + 1] || e < this._offsets[r + 1]) && this._activate(this._targets[r])
					}
				}, n._activate = function (e) {
					this._activeTarget = e, this._clear();
					var n = this._selector.split(",").map(function (t) {
							return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
						}),
						i = t([].slice.call(document.querySelectorAll(n.join(","))));
					i.hasClass(vi) ? (i.closest(Ti).find(ki).addClass(yi), i.addClass(yi)) : (i.addClass(yi), i.parents(bi).prev(wi + ", " + Ci).addClass(yi), i.parents(bi).prev(Si).children(wi).addClass(yi)), t(this._scrollElement).trigger(gi.ACTIVATE, {
						relatedTarget: e
					})
				}, n._clear = function () {
					[].slice.call(document.querySelectorAll(this._selector)).filter(function (e) {
						return e.classList.contains(yi)
					}).forEach(function (e) {
						return e.classList.remove(yi)
					})
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this).data(ui);
						if (i || (i = new e(this, "object" == typeof n && n), t(this).data(ui, i)), "string" == typeof n) {
							if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
							i[n]()
						}
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "Default",
					get: function () {
						return hi
					}
				}]), e
			}();
		t(window).on(gi.LOAD_DATA_API, function () {
			for (var e = [].slice.call(document.querySelectorAll(Ai)), n = e.length; n--;) {
				var i = t(e[n]);
				Pi._jQueryInterface.call(i, i.data())
			}
		}), t.fn[di] = Pi._jQueryInterface, t.fn[di].Constructor = Pi, t.fn[di].noConflict = function () {
			return t.fn[di] = fi, Pi._jQueryInterface
		};
		var Di = "bs.tab",
			$i = "." + Di,
			Ri = t.fn.tab,
			Ii = {
				HIDE: "hide" + $i,
				HIDDEN: "hidden" + $i,
				SHOW: "show" + $i,
				SHOWN: "shown" + $i,
				CLICK_DATA_API: "click" + $i + ".data-api"
			},
			Oi = "dropdown-menu",
			Li = "active",
			Mi = "disabled",
			ji = "fade",
			Ni = "show",
			Ji = ".dropdown",
			Hi = ".nav, .list-group",
			Fi = ".active",
			Bi = "> li > .active",
			qi = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
			zi = ".dropdown-toggle",
			Wi = "> .dropdown-menu .active",
			Ui = function () {
				function e(e) {
					this._element = e
				}
				var n = e.prototype;
				return n.show = function () {
					var e = this;
					if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && t(this._element).hasClass(Li) || t(this._element).hasClass(Mi))) {
						var n, i, r = t(this._element).closest(Hi)[0],
							o = G.getSelectorFromElement(this._element);
						if (r) {
							var s = "UL" === r.nodeName || "OL" === r.nodeName ? Bi : Fi;
							i = (i = t.makeArray(t(r).find(s)))[i.length - 1]
						}
						var a = t.Event(Ii.HIDE, {
								relatedTarget: this._element
							}),
							c = t.Event(Ii.SHOW, {
								relatedTarget: i
							});
						if (i && t(i).trigger(a), t(this._element).trigger(c), !c.isDefaultPrevented() && !a.isDefaultPrevented()) {
							o && (n = document.querySelector(o)), this._activate(this._element, r);
							var l = function () {
								var n = t.Event(Ii.HIDDEN, {
										relatedTarget: e._element
									}),
									r = t.Event(Ii.SHOWN, {
										relatedTarget: i
									});
								t(i).trigger(n), t(e._element).trigger(r)
							};
							n ? this._activate(n, n.parentNode, l) : l()
						}
					}
				}, n.dispose = function () {
					t.removeData(this._element, Di), this._element = null
				}, n._activate = function (e, n, i) {
					function r() {
						return o._transitionComplete(e, s, i)
					}
					var o = this,
						s = (!n || "UL" !== n.nodeName && "OL" !== n.nodeName ? t(n).children(Fi) : t(n).find(Bi))[0],
						a = i && s && t(s).hasClass(ji);
					if (s && a) {
						var c = G.getTransitionDurationFromElement(s);
						t(s).removeClass(Ni).one(G.TRANSITION_END, r).emulateTransitionEnd(c)
					} else r()
				}, n._transitionComplete = function (e, n, i) {
					if (n) {
						t(n).removeClass(Li);
						var r = t(n.parentNode).find(Wi)[0];
						r && t(r).removeClass(Li), "tab" === n.getAttribute("role") && n.setAttribute("aria-selected", !1)
					}
					if (t(e).addClass(Li), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !0), G.reflow(e), e.classList.contains(ji) && e.classList.add(Ni), e.parentNode && t(e.parentNode).hasClass(Oi)) {
						var o = t(e).closest(Ji)[0];
						if (o) {
							var s = [].slice.call(o.querySelectorAll(zi));
							t(s).addClass(Li)
						}
						e.setAttribute("aria-expanded", !0)
					}
					i && i()
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this),
							r = i.data(Di);
						if (r || (r = new e(this), i.data(Di, r)), "string" == typeof n) {
							if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
							r[n]()
						}
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}]), e
			}();
		t(document).on(Ii.CLICK_DATA_API, qi, function (e) {
			e.preventDefault(), Ui._jQueryInterface.call(t(this), "show")
		}), t.fn.tab = Ui._jQueryInterface, t.fn.tab.Constructor = Ui, t.fn.tab.noConflict = function () {
			return t.fn.tab = Ri, Ui._jQueryInterface
		};
		var Vi = "toast",
			Gi = "bs.toast",
			Qi = "." + Gi,
			Yi = t.fn[Vi],
			Xi = {
				CLICK_DISMISS: "click.dismiss" + Qi,
				HIDE: "hide" + Qi,
				HIDDEN: "hidden" + Qi,
				SHOW: "show" + Qi,
				SHOWN: "shown" + Qi
			},
			Ki = "fade",
			Zi = "hide",
			er = "show",
			tr = "showing",
			nr = {
				animation: "boolean",
				autohide: "boolean",
				delay: "number"
			},
			ir = {
				animation: !0,
				autohide: !0,
				delay: 500
			},
			rr = '[data-dismiss="toast"]',
			or = function () {
				function e(e, t) {
					this._element = e, this._config = this._getConfig(t), this._timeout = null, this._setListeners()
				}
				var n = e.prototype;
				return n.show = function () {
					var e = this,
						n = t.Event(Xi.SHOW);
					if (t(this._element).trigger(n), !n.isDefaultPrevented()) {
						this._config.animation && this._element.classList.add(Ki);
						var i = function () {
							e._element.classList.remove(tr), e._element.classList.add(er), t(e._element).trigger(Xi.SHOWN), e._config.autohide && (e._timeout = setTimeout(function () {
								e.hide()
							}, e._config.delay))
						};
						if (this._element.classList.remove(Zi), G.reflow(this._element), this._element.classList.add(tr), this._config.animation) {
							var r = G.getTransitionDurationFromElement(this._element);
							t(this._element).one(G.TRANSITION_END, i).emulateTransitionEnd(r)
						} else i()
					}
				}, n.hide = function () {
					if (this._element.classList.contains(er)) {
						var e = t.Event(Xi.HIDE);
						t(this._element).trigger(e), e.isDefaultPrevented() || this._close()
					}
				}, n.dispose = function () {
					clearTimeout(this._timeout), this._timeout = null, this._element.classList.contains(er) && this._element.classList.remove(er), t(this._element).off(Xi.CLICK_DISMISS), t.removeData(this._element, Gi), this._element = null, this._config = null
				}, n._getConfig = function (e) {
					return e = o({}, ir, {}, t(this._element).data(), {}, "object" == typeof e && e ? e : {}), G.typeCheckConfig(Vi, e, this.constructor.DefaultType), e
				}, n._setListeners = function () {
					var e = this;
					t(this._element).on(Xi.CLICK_DISMISS, rr, function () {
						return e.hide()
					})
				}, n._close = function () {
					function e() {
						n._element.classList.add(Zi), t(n._element).trigger(Xi.HIDDEN)
					}
					var n = this;
					if (this._element.classList.remove(er), this._config.animation) {
						var i = G.getTransitionDurationFromElement(this._element);
						t(this._element).one(G.TRANSITION_END, e).emulateTransitionEnd(i)
					} else e()
				}, e._jQueryInterface = function (n) {
					return this.each(function () {
						var i = t(this),
							r = i.data(Gi);
						if (r || (r = new e(this, "object" == typeof n && n), i.data(Gi, r)), "string" == typeof n) {
							if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
							r[n](this)
						}
					})
				}, i(e, null, [{
					key: "VERSION",
					get: function () {
						return "4.4.1"
					}
				}, {
					key: "DefaultType",
					get: function () {
						return nr
					}
				}, {
					key: "Default",
					get: function () {
						return ir
					}
				}]), e
			}();
		t.fn[Vi] = or._jQueryInterface, t.fn[Vi].Constructor = or, t.fn[Vi].noConflict = function () {
			return t.fn[Vi] = Yi, or._jQueryInterface
		}, e.Alert = ie, e.Button = be, e.Carousel = Ye, e.Collapse = pt, e.Dropdown = tn, e.Modal = Cn, e.Popover = li, e.Scrollspy = Pi, e.Tab = Ui, e.Toast = or, e.Tooltip = Qn, e.Util = G, Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}),
	/*!
	 * jQuery Cookie Plugin v1.4.1
	 * https://github.com/carhartl/jquery-cookie
	 *
	 * Copyright 2006, 2014 Klaus Hartl
	 * Released under the MIT license
	 */
	function (e) {
		"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
	}(function (e) {
		function t(e) {
			return a.raw ? e : encodeURIComponent(e)
		}

		function n(e) {
			return a.raw ? e : decodeURIComponent(e)
		}

		function i(e) {
			return t(a.json ? JSON.stringify(e) : String(e))
		}

		function r(e) {
			0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
			try {
				return e = decodeURIComponent(e.replace(s, " ")), a.json ? JSON.parse(e) : e
			} catch (t) {}
		}

		function o(t, n) {
			var i = a.raw ? t : r(t);
			return e.isFunction(n) ? n(i) : i
		}
		var s = /\+/g,
			a = e.cookie = function (r, s, c) {
				if (arguments.length > 1 && !e.isFunction(s)) {
					if ("number" == typeof (c = e.extend({}, a.defaults, c)).expires) {
						var l = c.expires,
							d = c.expires = new Date;
						d.setMilliseconds(d.getMilliseconds() + 864e5 * l)
					}
					return document.cookie = [t(r), "=", i(s), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join("")
				}
				for (var u = r ? undefined : {}, p = document.cookie ? document.cookie.split("; ") : [], f = 0, h = p.length; f < h; f++) {
					var m = p[f].split("="),
						g = n(m.shift()),
						v = m.join("=");
					if (r === g) {
						u = o(v, s);
						break
					}
					r || (v = o(v)) === undefined || (u[g] = v)
				}
				return u
			};
		a.defaults = {}, e.removeCookie = function (t, n) {
			return e.cookie(t, "", e.extend({}, n, {
				expires: -1
			})), !e.cookie(t)
		}
	}),
	// Copyright 2019 fancyApps
	function (e, t, n, i) {
		"use strict";

		function r(e, t) {
			var i, r, o, s = [],
				a = 0;
			e && e.isDefaultPrevented() || (e.preventDefault(), t = t || {}, e && e.data && (t = y(e.data.options, t)), i = t.$target || n(e.currentTarget).trigger("blur"), (o = n.fancybox.getInstance()) && o.$trigger && o.$trigger.is(i) || (s = t.selector ? n(t.selector) : (r = i.attr("data-fancybox") || "") ? (s = e.data ? e.data.items : []).length ? s.filter('[data-fancybox="' + r + '"]') : n('[data-fancybox="' + r + '"]') : [i], (a = n(s).index(i)) < 0 && (a = 0), (o = n.fancybox.open(s, t, a)).$trigger = i))
		}
		if (e.console = e.console || {
				info: function () {}
			}, n)
			if (n.fn.fancybox) console.info("fancyBox already initialized");
			else {
				var o, s, a, c, l = {
						closeExisting: !1,
						loop: !1,
						gutter: 50,
						keyboard: !0,
						preventCaptionOverlap: !0,
						arrows: !0,
						infobar: !0,
						smallBtn: "auto",
						toolbar: "auto",
						buttons: ["zoom", "slideShow", "thumbs", "close"],
						idleTime: 3,
						protect: !1,
						modal: !1,
						image: {
							preload: !1
						},
						ajax: {
							settings: {
								data: {
									fancybox: !0
								}
							}
						},
						iframe: {
							tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
							preload: !0,
							css: {},
							attr: {
								scrolling: "auto"
							}
						},
						video: {
							tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',
							format: "",
							autoStart: !0
						},
						defaultType: "image",
						animationEffect: "zoom",
						animationDuration: 366,
						zoomOpacity: "auto",
						transitionEffect: "fade",
						transitionDuration: 366,
						slideClass: "",
						baseClass: "",
						baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>',
						spinnerTpl: '<div class="fancybox-loading"></div>',
						errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
						btnTpl: {
							download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',
							zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',
							close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',
							arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',
							arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',
							smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'
						},
						parentEl: "body",
						hideScrollbar: !0,
						autoFocus: !0,
						backFocus: !0,
						trapFocus: !0,
						fullScreen: {
							autoStart: !1
						},
						touch: {
							vertical: !0,
							momentum: !0
						},
						hash: null,
						media: {},
						slideShow: {
							autoStart: !1,
							speed: 3e3
						},
						thumbs: {
							autoStart: !1,
							hideOnClose: !0,
							parentEl: ".fancybox-container",
							axis: "y"
						},
						wheel: "auto",
						onInit: n.noop,
						beforeLoad: n.noop,
						afterLoad: n.noop,
						beforeShow: n.noop,
						afterShow: n.noop,
						beforeClose: n.noop,
						afterClose: n.noop,
						onActivate: n.noop,
						onDeactivate: n.noop,
						clickContent: function (e) {
							return "image" === e.type && "zoom"
						},
						clickSlide: "close",
						clickOutside: "close",
						dblclickContent: !1,
						dblclickSlide: !1,
						dblclickOutside: !1,
						mobile: {
							preventCaptionOverlap: !1,
							idleTime: !1,
							clickContent: function (e) {
								return "image" === e.type && "toggleControls"
							},
							clickSlide: function (e) {
								return "image" === e.type ? "toggleControls" : "close"
							},
							dblclickContent: function (e) {
								return "image" === e.type && "zoom"
							},
							dblclickSlide: function (e) {
								return "image" === e.type && "zoom"
							}
						},
						lang: "en",
						i18n: {
							en: {
								CLOSE: "Close",
								NEXT: "Next",
								PREV: "Previous",
								ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
								PLAY_START: "Start slideshow",
								PLAY_STOP: "Pause slideshow",
								FULL_SCREEN: "Full screen",
								THUMBS: "Thumbnails",
								DOWNLOAD: "Download",
								SHARE: "Share",
								ZOOM: "Zoom"
							},
							de: {
								CLOSE: "Schlie&szlig;en",
								NEXT: "Weiter",
								PREV: "Zur&uuml;ck",
								ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
								PLAY_START: "Diaschau starten",
								PLAY_STOP: "Diaschau beenden",
								FULL_SCREEN: "Vollbild",
								THUMBS: "Vorschaubilder",
								DOWNLOAD: "Herunterladen",
								SHARE: "Teilen",
								ZOOM: "Vergr&ouml;&szlig;ern"
							}
						}
					},
					d = n(e),
					u = n(t),
					p = 0,
					f = function (e) {
						return e && e.hasOwnProperty && e instanceof n
					},
					h = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || function (t) {
						return e.setTimeout(t, 1e3 / 60)
					},
					m = e.cancelAnimationFrame || e.webkitCancelAnimationFrame || e.mozCancelAnimationFrame || e.oCancelAnimationFrame || function (t) {
						e.clearTimeout(t)
					},
					g = function () {
						var e, n = t.createElement("fakeelement"),
							r = {
								transition: "transitionend",
								OTransition: "oTransitionEnd",
								MozTransition: "transitionend",
								WebkitTransition: "webkitTransitionEnd"
							};
						for (e in r)
							if (n.style[e] !== i) return r[e];
						return "transitionend"
					}(),
					v = function (e) {
						return e && e.length && e[0].offsetHeight
					},
					y = function (e, t) {
						var i = n.extend(!0, {}, e, t);
						return n.each(t, function (e, t) {
							n.isArray(t) && (i[e] = t)
						}), i
					},
					A = function (e) {
						var i, r;
						return !(!e || e.ownerDocument !== t) && (n(".fancybox-container").css("pointer-events", "none"), i = {
							x: e.getBoundingClientRect().left + e.offsetWidth / 2,
							y: e.getBoundingClientRect().top + e.offsetHeight / 2
						}, r = t.elementFromPoint(i.x, i.y) === e, n(".fancybox-container").css("pointer-events", ""), r)
					},
					b = function (e, t, i) {
						var r = this;
						r.opts = y({
							index: i
						}, n.fancybox.defaults), n.isPlainObject(t) && (r.opts = y(r.opts, t)), n.fancybox.isMobile && (r.opts = y(r.opts, r.opts.mobile)), r.id = r.opts.id || ++p, r.currIndex = parseInt(r.opts.index, 10) || 0, r.prevIndex = null, r.prevPos = null, r.currPos = 0, r.firstRun = !0, r.group = [], r.slides = {}, r.addContent(e), r.group.length && r.init()
					};
				n.extend(b.prototype, {
					init: function () {
						var i, r, o = this,
							s = o.group[o.currIndex].opts;
						s.closeExisting && n.fancybox.close(!0), n("body").addClass("fancybox-active"), !n.fancybox.getInstance() && !1 !== s.hideScrollbar && !n.fancybox.isMobile && t.body.scrollHeight > e.innerHeight && (n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (e.innerWidth - t.documentElement.clientWidth) + "px;}</style>"), n("body").addClass("compensate-for-scrollbar")), r = "", n.each(s.buttons, function (e, t) {
							r += s.btnTpl[t] || ""
						}), i = n(o.translate(o, s.baseTpl.replace("{{buttons}}", r).replace("{{arrows}}", s.btnTpl.arrowLeft + s.btnTpl.arrowRight))).attr("id", "fancybox-container-" + o.id).addClass(s.baseClass).data("FancyBox", o).appendTo(s.parentEl), o.$refs = {
							container: i
						}, ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (e) {
							o.$refs[e] = i.find(".fancybox-" + e)
						}), o.trigger("onInit"), o.activate(), o.jumpTo(o.currIndex)
					},
					translate: function (e, t) {
						var n = e.opts.i18n[e.opts.lang] || e.opts.i18n.en;
						return t.replace(/\{\{(\w+)\}\}/g, function (e, t) {
							return n[t] === i ? e : n[t]
						})
					},
					addContent: function (e) {
						var t, r = this,
							o = n.makeArray(e);
						n.each(o, function (e, t) {
							var o, s, a, c, l, d = {},
								u = {};
							n.isPlainObject(t) ? (d = t, u = t.opts || t) : "object" === n.type(t) && n(t).length ? (u = (o = n(t)).data() || {}, (u = n.extend(!0, {}, u, u.options)).$orig = o, d.src = r.opts.src || u.src || o.attr("href"), d.type || d.src || (d.type = "inline", d.src = t)) : d = {
								type: "html",
								src: t + ""
							}, d.opts = n.extend(!0, {}, r.opts, u), n.isArray(u.buttons) && (d.opts.buttons = u.buttons), n.fancybox.isMobile && d.opts.mobile && (d.opts = y(d.opts, d.opts.mobile)), s = d.type || d.opts.type, c = d.src || "", !s && c && ((a = c.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (s = "video", d.opts.video.format || (d.opts.video.format = "video/" + ("ogv" === a[1] ? "ogg" : a[1]))) : c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s = "image" : c.match(/\.(pdf)((\?|#).*)?$/i) ? (s = "iframe", d = n.extend(!0, d, {
								contentType: "pdf",
								opts: {
									iframe: {
										preload: !1
									}
								}
							})) : "#" === c.charAt(0) && (s = "inline")), s ? d.type = s : r.trigger("objectNeedsType", d), d.contentType || (d.contentType = n.inArray(d.type, ["html", "inline", "ajax"]) > -1 ? "html" : d.type), d.index = r.group.length, "auto" == d.opts.smallBtn && (d.opts.smallBtn = n.inArray(d.type, ["html", "inline", "ajax"]) > -1), "auto" === d.opts.toolbar && (d.opts.toolbar = !d.opts.smallBtn), d.$thumb = d.opts.$thumb || null, d.opts.$trigger && d.index === r.opts.index && (d.$thumb = d.opts.$trigger.find("img:first"), d.$thumb.length && (d.opts.$orig = d.opts.$trigger)), d.$thumb && d.$thumb.length || !d.opts.$orig || (d.$thumb = d.opts.$orig.find("img:first")), d.$thumb && !d.$thumb.length && (d.$thumb = null), d.thumb = d.opts.thumb || (d.$thumb ? d.$thumb[0].src : null), "function" === n.type(d.opts.caption) && (d.opts.caption = d.opts.caption.apply(t, [r, d])), "function" === n.type(r.opts.caption) && (d.opts.caption = r.opts.caption.apply(t, [r, d])), d.opts.caption instanceof n || (d.opts.caption = d.opts.caption === i ? "" : d.opts.caption + ""), "ajax" === d.type && (l = c.split(/\s+/, 2)).length > 1 && (d.src = l.shift(), d.opts.filter = l.shift()), d.opts.modal && (d.opts = n.extend(!0, d.opts, {
								trapFocus: !0,
								infobar: 0,
								toolbar: 0,
								smallBtn: 0,
								keyboard: 0,
								slideShow: 0,
								fullScreen: 0,
								thumbs: 0,
								touch: 0,
								clickContent: !1,
								clickSlide: !1,
								clickOutside: !1,
								dblclickContent: !1,
								dblclickSlide: !1,
								dblclickOutside: !1
							})), r.group.push(d)
						}), Object.keys(r.slides).length && (r.updateControls(), (t = r.Thumbs) && t.isActive && (t.create(), t.focus()))
					},
					addEvents: function () {
						var t = this;
						t.removeEvents(), t.$refs.container.on("click.fb-close", "[data-fancybox-close]", function (e) {
							e.stopPropagation(), e.preventDefault(), t.close(e)
						}).on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function (e) {
							e.stopPropagation(), e.preventDefault(), t.previous()
						}).on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function (e) {
							e.stopPropagation(), e.preventDefault(), t.next()
						}).on("click.fb", "[data-fancybox-zoom]", function () {
							t[t.isScaledDown() ? "scaleToActual" : "scaleToFit"]()
						}), d.on("orientationchange.fb resize.fb", function (e) {
							e && e.originalEvent && "resize" === e.originalEvent.type ? (t.requestId && m(t.requestId), t.requestId = h(function () {
								t.update(e)
							})) : (t.current && "iframe" === t.current.type && t.$refs.stage.hide(), setTimeout(function () {
								t.$refs.stage.show(), t.update(e)
							}, n.fancybox.isMobile ? 600 : 250))
						}), u.on("keydown.fb", function (e) {
							var i = (n.fancybox ? n.fancybox.getInstance() : null).current,
								r = e.keyCode || e.which;
							if (9 != r) {
								if (!(!i.opts.keyboard || e.ctrlKey || e.altKey || e.shiftKey || n(e.target).is("input,textarea,video,audio,select"))) return 8 === r || 27 === r ? (e.preventDefault(), void t.close(e)) : 37 === r || 38 === r ? (e.preventDefault(), void t.previous()) : 39 === r || 40 === r ? (e.preventDefault(), void t.next()) : void t.trigger("afterKeydown", e, r)
							} else i.opts.trapFocus && t.focus(e)
						}), t.group[t.currIndex].opts.idleTime && (t.idleSecondsCounter = 0, u.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function () {
							t.idleSecondsCounter = 0, t.isIdle && t.showControls(), t.isIdle = !1
						}), t.idleInterval = e.setInterval(function () {
							t.idleSecondsCounter++, t.idleSecondsCounter >= t.group[t.currIndex].opts.idleTime && !t.isDragging && (t.isIdle = !0, t.idleSecondsCounter = 0, t.hideControls())
						}, 1e3))
					},
					removeEvents: function () {
						var t = this;
						d.off("orientationchange.fb resize.fb"), u.off("keydown.fb .fb-idle"), this.$refs.container.off(".fb-close .fb-prev .fb-next"), t.idleInterval && (e.clearInterval(t.idleInterval), t.idleInterval = null)
					},
					previous: function (e) {
						return this.jumpTo(this.currPos - 1, e)
					},
					next: function (e) {
						return this.jumpTo(this.currPos + 1, e)
					},
					jumpTo: function (e, t) {
						var r, o, s, a, c, l, d, u, p, f = this,
							h = f.group.length;
						if (!(f.isDragging || f.isClosing || f.isAnimating && f.firstRun)) {
							if (e = parseInt(e, 10), !(s = f.current ? f.current.opts.loop : f.opts.loop) && (e < 0 || e >= h)) return !1;
							if (r = f.firstRun = !Object.keys(f.slides).length, c = f.current, f.prevIndex = f.currIndex, f.prevPos = f.currPos, a = f.createSlide(e), h > 1 && ((s || a.index < h - 1) && f.createSlide(e + 1), (s || a.index > 0) && f.createSlide(e - 1)), f.current = a, f.currIndex = a.index, f.currPos = a.pos, f.trigger("beforeShow", r), f.updateControls(), a.forcedDuration = i, n.isNumeric(t) ? a.forcedDuration = t : t = a.opts[r ? "animationDuration" : "transitionDuration"], t = parseInt(t, 10), o = f.isMoved(a), a.$slide.addClass("fancybox-slide--current"), r) return a.opts.animationEffect && t && f.$refs.container.css("transition-duration", t + "ms"), f.$refs.container.addClass("fancybox-is-open").trigger("focus"), f.loadSlide(a), void f.preload("image");
							l = n.fancybox.getTranslate(c.$slide), d = n.fancybox.getTranslate(f.$refs.stage), n.each(f.slides, function (e, t) {
								n.fancybox.stop(t.$slide, !0)
							}), c.pos !== a.pos && (c.isComplete = !1), c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"), o ? (p = l.left - (c.pos * l.width + c.pos * c.opts.gutter), n.each(f.slides, function (e, i) {
								i.$slide.removeClass("fancybox-animated").removeClass(function (e, t) {
									return (t.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ")
								});
								var r = i.pos * l.width + i.pos * i.opts.gutter;
								n.fancybox.setTranslate(i.$slide, {
									top: 0,
									left: r - d.left + p
								}), i.pos !== a.pos && i.$slide.addClass("fancybox-slide--" + (i.pos > a.pos ? "next" : "previous")), v(i.$slide), n.fancybox.animate(i.$slide, {
									top: 0,
									left: (i.pos - a.pos) * l.width + (i.pos - a.pos) * i.opts.gutter
								}, t, function () {
									i.$slide.css({
										transform: "",
										opacity: ""
									}).removeClass("fancybox-slide--next fancybox-slide--previous"), i.pos === f.currPos && f.complete()
								})
							})) : t && a.opts.transitionEffect && (u = "fancybox-animated fancybox-fx-" + a.opts.transitionEffect, c.$slide.addClass("fancybox-slide--" + (c.pos > a.pos ? "next" : "previous")), n.fancybox.animate(c.$slide, u, t, function () {
								c.$slide.removeClass(u).removeClass("fancybox-slide--next fancybox-slide--previous")
							}, !1)), a.isLoaded ? f.revealContent(a) : f.loadSlide(a), f.preload("image")
						}
					},
					createSlide: function (e) {
						var t, i, r = this;
						return i = (i = e % r.group.length) < 0 ? r.group.length + i : i, !r.slides[e] && r.group[i] && (t = n('<div class="fancybox-slide"></div>').appendTo(r.$refs.stage), r.slides[e] = n.extend(!0, {}, r.group[i], {
							pos: e,
							$slide: t,
							isLoaded: !1
						}), r.updateSlide(r.slides[e])), r.slides[e]
					},
					scaleToActual: function (e, t, r) {
						var o, s, a, c, l, d = this,
							u = d.current,
							p = u.$content,
							f = n.fancybox.getTranslate(u.$slide).width,
							h = n.fancybox.getTranslate(u.$slide).height,
							m = u.width,
							g = u.height;
						d.isAnimating || d.isMoved() || !p || "image" != u.type || !u.isLoaded || u.hasError || (d.isAnimating = !0, n.fancybox.stop(p), e = e === i ? .5 * f : e, t = t === i ? .5 * h : t, (o = n.fancybox.getTranslate(p)).top -= n.fancybox.getTranslate(u.$slide).top, o.left -= n.fancybox.getTranslate(u.$slide).left, c = m / o.width, l = g / o.height, s = .5 * f - .5 * m, a = .5 * h - .5 * g, m > f && ((s = o.left * c - (e * c - e)) > 0 && (s = 0), s < f - m && (s = f - m)), g > h && ((a = o.top * l - (t * l - t)) > 0 && (a = 0), a < h - g && (a = h - g)), d.updateCursor(m, g), n.fancybox.animate(p, {
							top: a,
							left: s,
							scaleX: c,
							scaleY: l
						}, r || 366, function () {
							d.isAnimating = !1
						}), d.SlideShow && d.SlideShow.isActive && d.SlideShow.stop())
					},
					scaleToFit: function (e) {
						var t, i = this,
							r = i.current,
							o = r.$content;
						i.isAnimating || i.isMoved() || !o || "image" != r.type || !r.isLoaded || r.hasError || (i.isAnimating = !0, n.fancybox.stop(o), t = i.getFitPos(r), i.updateCursor(t.width, t.height), n.fancybox.animate(o, {
							top: t.top,
							left: t.left,
							scaleX: t.width / o.width(),
							scaleY: t.height / o.height()
						}, e || 366, function () {
							i.isAnimating = !1
						}))
					},
					getFitPos: function (e) {
						var t, i, r, o, s = this,
							a = e.$content,
							c = e.$slide,
							l = e.width || e.opts.width,
							d = e.height || e.opts.height,
							u = {};
						return !!(e.isLoaded && a && a.length) && (t = n.fancybox.getTranslate(s.$refs.stage).width, i = n.fancybox.getTranslate(s.$refs.stage).height, t -= parseFloat(c.css("paddingLeft")) + parseFloat(c.css("paddingRight")) + parseFloat(a.css("marginLeft")) + parseFloat(a.css("marginRight")), i -= parseFloat(c.css("paddingTop")) + parseFloat(c.css("paddingBottom")) + parseFloat(a.css("marginTop")) + parseFloat(a.css("marginBottom")), l && d || (l = t, d = i), (l *= r = Math.min(1, t / l, i / d)) > t - .5 && (l = t), (d *= r) > i - .5 && (d = i), "image" === e.type ? (u.top = Math.floor(.5 * (i - d)) + parseFloat(c.css("paddingTop")), u.left = Math.floor(.5 * (t - l)) + parseFloat(c.css("paddingLeft"))) : "video" === e.contentType && (d > l / (o = e.opts.width && e.opts.height ? l / d : e.opts.ratio || 16 / 9) ? d = l / o : l > d * o && (l = d * o)), u.width = l, u.height = d, u)
					},
					update: function (e) {
						var t = this;
						n.each(t.slides, function (n, i) {
							t.updateSlide(i, e)
						})
					},
					updateSlide: function (e, t) {
						var i = this,
							r = e && e.$content,
							o = e.width || e.opts.width,
							s = e.height || e.opts.height,
							a = e.$slide;
						i.adjustCaption(e), r && (o || s || "video" === e.contentType) && !e.hasError && (n.fancybox.stop(r), n.fancybox.setTranslate(r, i.getFitPos(e)), e.pos === i.currPos && (i.isAnimating = !1, i.updateCursor())), i.adjustLayout(e), a.length && (a.trigger("refresh"), e.pos === i.currPos && i.$refs.toolbar.add(i.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar", a.get(0).scrollHeight > a.get(0).clientHeight)), i.trigger("onUpdate", e, t)
					},
					centerSlide: function (e) {
						var t = this,
							r = t.current,
							o = r.$slide;
						!t.isClosing && r && (o.siblings().css({
							transform: "",
							opacity: ""
						}), o.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next"), n.fancybox.animate(o, {
							top: 0,
							left: 0,
							opacity: 1
						}, e === i ? 0 : e, function () {
							o.css({
								transform: "",
								opacity: ""
							}), r.isComplete || t.complete()
						}, !1))
					},
					isMoved: function (e) {
						var t, i, r = e || this.current;
						return !!r && (i = n.fancybox.getTranslate(this.$refs.stage), t = n.fancybox.getTranslate(r.$slide), !r.$slide.hasClass("fancybox-animated") && (Math.abs(t.top - i.top) > .5 || Math.abs(t.left - i.left) > .5))
					},
					updateCursor: function (e, t) {
						var i, r, o = this,
							s = o.current,
							a = o.$refs.container;
						s && !o.isClosing && o.Guestures && (a.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"), r = !!(i = o.canPan(e, t)) || o.isZoomable(), a.toggleClass("fancybox-is-zoomable", r), n("[data-fancybox-zoom]").prop("disabled", !r), i ? a.addClass("fancybox-can-pan") : r && ("zoom" === s.opts.clickContent || n.isFunction(s.opts.clickContent) && "zoom" == s.opts.clickContent(s)) ? a.addClass("fancybox-can-zoomIn") : s.opts.touch && (s.opts.touch.vertical || o.group.length > 1) && "video" !== s.contentType && a.addClass("fancybox-can-swipe"))
					},
					isZoomable: function () {
						var e, t = this,
							n = t.current;
						if (n && !t.isClosing && "image" === n.type && !n.hasError) {
							if (!n.isLoaded) return !0;
							if ((e = t.getFitPos(n)) && (n.width > e.width || n.height > e.height)) return !0
						}
						return !1
					},
					isScaledDown: function (e, t) {
						var r = !1,
							o = this.current,
							s = o.$content;
						return e !== i && t !== i ? r = e < o.width && t < o.height : s && (r = (r = n.fancybox.getTranslate(s)).width < o.width && r.height < o.height), r
					},
					canPan: function (e, t) {
						var r = this,
							o = r.current,
							s = null,
							a = !1;
						return "image" === o.type && (o.isComplete || e && t) && !o.hasError && (a = r.getFitPos(o), e !== i && t !== i ? s = {
							width: e,
							height: t
						} : o.isComplete && (s = n.fancybox.getTranslate(o.$content)), s && a && (a = Math.abs(s.width - a.width) > 1.5 || Math.abs(s.height - a.height) > 1.5)), a
					},
					loadSlide: function (e) {
						var t, i, r, o = this;
						if (!e.isLoading && !e.isLoaded) {
							if (e.isLoading = !0, !1 === o.trigger("beforeLoad", e)) return e.isLoading = !1, !1;
							switch (t = e.type, (i = e.$slide).off("refresh").trigger("onReset").addClass(e.opts.slideClass), t) {
								case "image":
									o.setImage(e);
									break;
								case "iframe":
									o.setIframe(e);
									break;
								case "html":
									o.setContent(e, e.src || e.content);
									break;
								case "video":
									o.setContent(e, e.opts.video.tpl.replace(/\{\{src\}\}/gi, e.src).replace("{{format}}", e.opts.videoFormat || e.opts.video.format || "").replace("{{poster}}", e.thumb || ""));
									break;
								case "inline":
									n(e.src).length ? o.setContent(e, n(e.src)) : o.setError(e);
									break;
								case "ajax":
									o.showLoading(e), r = n.ajax(n.extend({}, e.opts.ajax.settings, {
										url: e.src,
										success: function (t, n) {
											"success" === n && o.setContent(e, t)
										},
										error: function (t, n) {
											t && "abort" !== n && o.setError(e)
										}
									})), i.one("onReset", function () {
										r.abort()
									});
									break;
								default:
									o.setError(e)
							}
							return !0
						}
					},
					setImage: function (e) {
						var i, r = this;
						setTimeout(function () {
							var t = e.$image;
							r.isClosing || !e.isLoading || t && t.length && t[0].complete || e.hasError || r.showLoading(e)
						}, 50), r.checkSrcset(e), e.$content = n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide.addClass("fancybox-slide--image")), !1 !== e.opts.preload && e.opts.width && e.opts.height && e.thumb && (e.width = e.opts.width, e.height = e.opts.height, (i = t.createElement("img")).onerror = function () {
							n(this).remove(), e.$ghost = null
						}, i.onload = function () {
							r.afterLoad(e)
						}, e.$ghost = n(i).addClass("fancybox-image").appendTo(e.$content).attr("src", e.thumb)), r.setBigImage(e)
					},
					checkSrcset: function (t) {
						var n, i, r, o, s = t.opts.srcset || t.opts.image.srcset;
						if (s) {
							r = e.devicePixelRatio || 1, o = e.innerWidth * r, (i = s.split(",").map(function (e) {
								var t = {};
								return e.trim().split(/\s+/).forEach(function (e, n) {
									var i = parseInt(e.substring(0, e.length - 1), 10);
									if (0 === n) return t.url = e;
									i && (t.value = i, t.postfix = e[e.length - 1])
								}), t
							})).sort(function (e, t) {
								return e.value - t.value
							});
							for (var a = 0; a < i.length; a++) {
								var c = i[a];
								if ("w" === c.postfix && c.value >= o || "x" === c.postfix && c.value >= r) {
									n = c;
									break
								}
							}!n && i.length && (n = i[i.length - 1]), n && (t.src = n.url, t.width && t.height && "w" == n.postfix && (t.height = t.width / t.height * n.value, t.width = n.value), t.opts.srcset = s)
						}
					},
					setBigImage: function (e) {
						var i = this,
							r = t.createElement("img"),
							o = n(r);
						e.$image = o.one("error", function () {
							i.setError(e)
						}).one("load", function () {
							var t;
							e.$ghost || (i.resolveImageSlideSize(e, this.naturalWidth, this.naturalHeight), i.afterLoad(e)), i.isClosing || (e.opts.srcset && ((t = e.opts.sizes) && "auto" !== t || (t = (e.width / e.height > 1 && d.width() / d.height() > 1 ? "100" : Math.round(e.width / e.height * 100)) + "vw"), o.attr("sizes", t).attr("srcset", e.opts.srcset)), e.$ghost && setTimeout(function () {
								e.$ghost && !i.isClosing && e.$ghost.hide()
							}, Math.min(300, Math.max(1e3, e.height / 1600))), i.hideLoading(e))
						}).addClass("fancybox-image").attr("src", e.src).appendTo(e.$content), (r.complete || "complete" == r.readyState) && o.naturalWidth && o.naturalHeight ? o.trigger("load") : r.error && o.trigger("error")
					},
					resolveImageSlideSize: function (e, t, n) {
						var i = parseInt(e.opts.width, 10),
							r = parseInt(e.opts.height, 10);
						e.width = t, e.height = n, i > 0 && (e.width = i, e.height = Math.floor(i * n / t)), r > 0 && (e.width = Math.floor(r * t / n), e.height = r)
					},
					setIframe: function (e) {
						var t, r = this,
							o = e.opts.iframe,
							s = e.$slide;
						e.$content = n('<div class="fancybox-content' + (o.preload ? " fancybox-is-hidden" : "") + '"></div>').css(o.css).appendTo(s), s.addClass("fancybox-slide--" + e.contentType), e.$iframe = t = n(o.tpl.replace(/\{rnd\}/g, (new Date).getTime())).attr(o.attr).appendTo(e.$content), o.preload ? (r.showLoading(e), t.on("load.fb error.fb", function () {
							this.isReady = 1, e.$slide.trigger("refresh"), r.afterLoad(e)
						}), s.on("refresh.fb", function () {
							var n, r = e.$content,
								a = o.css.width,
								c = o.css.height;
							if (1 === t[0].isReady) {
								try {
									n = t.contents().find("body")
								} catch (l) {}
								n && n.length && n.children().length && (s.css("overflow", "visible"), r.css({
									width: "100%",
									"max-width": "100%",
									height: "9999px"
								}), a === i && (a = Math.ceil(Math.max(n[0].clientWidth, n.outerWidth(!0)))), r.css("width", a || "").css("max-width", ""), c === i && (c = Math.ceil(Math.max(n[0].clientHeight, n.outerHeight(!0)))), r.css("height", c || ""), s.css("overflow", "auto")), r.removeClass("fancybox-is-hidden")
							}
						})) : r.afterLoad(e), t.attr("src", e.src), s.one("onReset", function () {
							try {
								n(this).find("iframe").hide().unbind().attr("src", "//about:blank")
							} catch (t) {}
							n(this).off("refresh.fb").empty(), e.isLoaded = !1, e.isRevealed = !1
						})
					},
					setContent: function (e, t) {
						var i = this;
						i.isClosing || (i.hideLoading(e), e.$content && n.fancybox.stop(e.$content), e.$slide.empty(), f(t) && t.parent().length ? ((t.hasClass("fancybox-content") || t.parent().hasClass("fancybox-content")) && t.parents(".fancybox-slide").trigger("onReset"), e.$placeholder = n("<div>").hide().insertAfter(t), t.css("display", "inline-block")) : e.hasError || ("string" === n.type(t) && (t = n("<div>").append(n.trim(t)).contents()), e.opts.filter && (t = n("<div>").html(t).find(e.opts.filter))), e.$slide.one("onReset", function () {
							n(this).find("video,audio").trigger("pause"), e.$placeholder && (e.$placeholder.after(t.removeClass("fancybox-content").hide()).remove(), e.$placeholder = null), e.$smallBtn && (e.$smallBtn.remove(), e.$smallBtn = null), e.hasError || (n(this).empty(), e.isLoaded = !1, e.isRevealed = !1)
						}), n(t).appendTo(e.$slide), n(t).is("video,audio") && (n(t).addClass("fancybox-video"), n(t).wrap("<div></div>"), e.contentType = "video", e.opts.width = e.opts.width || n(t).attr("width"), e.opts.height = e.opts.height || n(t).attr("height")), e.$content = e.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(), e.$content.siblings().hide(), e.$content.length || (e.$content = e.$slide.wrapInner("<div></div>").children().first()), e.$content.addClass("fancybox-content"), e.$slide.addClass("fancybox-slide--" + e.contentType), i.afterLoad(e))
					},
					setError: function (e) {
						e.hasError = !0, e.$slide.trigger("onReset").removeClass("fancybox-slide--" + e.contentType).addClass("fancybox-slide--error"), e.contentType = "html", this.setContent(e, this.translate(e, e.opts.errorTpl)), e.pos === this.currPos && (this.isAnimating = !1)
					},
					showLoading: function (e) {
						var t = this;
						(e = e || t.current) && !e.$spinner && (e.$spinner = n(t.translate(t, t.opts.spinnerTpl)).appendTo(e.$slide).hide().fadeIn("fast"))
					},
					hideLoading: function (e) {
						(e = e || this.current) && e.$spinner && (e.$spinner.stop().remove(), delete e.$spinner)
					},
					afterLoad: function (e) {
						var t = this;
						t.isClosing || (e.isLoading = !1, e.isLoaded = !0, t.trigger("afterLoad", e), t.hideLoading(e), !e.opts.smallBtn || e.$smallBtn && e.$smallBtn.length || (e.$smallBtn = n(t.translate(e, e.opts.btnTpl.smallBtn)).appendTo(e.$content)), e.opts.protect && e.$content && !e.hasError && (e.$content.on("contextmenu.fb", function (e) {
							return 2 == e.button && e.preventDefault(), !0
						}), "image" === e.type && n('<div class="fancybox-spaceball"></div>').appendTo(e.$content)), t.adjustCaption(e), t.adjustLayout(e), e.pos === t.currPos && t.updateCursor(), t.revealContent(e))
					},
					adjustCaption: function (e) {
						var t, n = this,
							i = e || n.current,
							r = i.opts.caption,
							o = i.opts.preventCaptionOverlap,
							s = n.$refs.caption,
							a = !1;
						s.toggleClass("fancybox-caption--separate", o), o && r && r.length && (i.pos !== n.currPos ? ((t = s.clone().appendTo(s.parent())).children().eq(0).empty().html(r), a = t.outerHeight(!0), t.empty().remove()) : n.$caption && (a = n.$caption.outerHeight(!0)), i.$slide.css("padding-bottom", a || ""))
					},
					adjustLayout: function (e) {
						var t, n, i, r, o = e || this.current;
						o.isLoaded && !0 !== o.opts.disableLayoutFix && (o.$content.css("margin-bottom", ""), o.$content.outerHeight() > o.$slide.height() + .5 && (i = o.$slide[0].style["padding-bottom"], r = o.$slide.css("padding-bottom"), parseFloat(r) > 0 && (t = o.$slide[0].scrollHeight, o.$slide.css("padding-bottom", 0), Math.abs(t - o.$slide[0].scrollHeight) < 1 && (n = r), o.$slide.css("padding-bottom", i))), o.$content.css("margin-bottom", n))
					},
					revealContent: function (e) {
						var t, r, o, s, a = this,
							c = e.$slide,
							l = !1,
							d = !1,
							u = a.isMoved(e),
							p = e.isRevealed;
						return e.isRevealed = !0, t = e.opts[a.firstRun ? "animationEffect" : "transitionEffect"], o = e.opts[a.firstRun ? "animationDuration" : "transitionDuration"], o = parseInt(e.forcedDuration === i ? o : e.forcedDuration, 10), !u && e.pos === a.currPos && o || (t = !1), "zoom" === t && (e.pos === a.currPos && o && "image" === e.type && !e.hasError && (d = a.getThumbPos(e)) ? l = a.getFitPos(e) : t = "fade"), "zoom" === t ? (a.isAnimating = !0, l.scaleX = l.width / d.width, l.scaleY = l.height / d.height, "auto" == (s = e.opts.zoomOpacity) && (s = Math.abs(e.width / e.height - d.width / d.height) > .1), s && (d.opacity = .1, l.opacity = 1), n.fancybox.setTranslate(e.$content.removeClass("fancybox-is-hidden"), d), v(e.$content), void n.fancybox.animate(e.$content, l, o, function () {
							a.isAnimating = !1, a.complete()
						})) : (a.updateSlide(e), t ? (n.fancybox.stop(c), r = "fancybox-slide--" + (e.pos >= a.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + t, c.addClass(r).removeClass("fancybox-slide--current"), e.$content.removeClass("fancybox-is-hidden"), v(c), "image" !== e.type && e.$content.hide().show(0), void n.fancybox.animate(c, "fancybox-slide--current", o, function () {
							c.removeClass(r).css({
								transform: "",
								opacity: ""
							}), e.pos === a.currPos && a.complete()
						}, !0)) : (e.$content.removeClass("fancybox-is-hidden"), p || !u || "image" !== e.type || e.hasError || e.$content.hide().fadeIn("fast"), void(e.pos === a.currPos && a.complete())))
					},
					getThumbPos: function (e) {
						var t, i, r, o, s, a = !1,
							c = e.$thumb;
						return !(!c || !A(c[0])) && (t = n.fancybox.getTranslate(c), i = parseFloat(c.css("border-top-width") || 0), r = parseFloat(c.css("border-right-width") || 0), o = parseFloat(c.css("border-bottom-width") || 0), s = parseFloat(c.css("border-left-width") || 0), a = {
							top: t.top + i,
							left: t.left + s,
							width: t.width - r - s,
							height: t.height - i - o,
							scaleX: 1,
							scaleY: 1
						}, t.width > 0 && t.height > 0 && a)
					},
					complete: function () {
						var e, t = this,
							i = t.current,
							r = {};
						!t.isMoved() && i.isLoaded && (i.isComplete || (i.isComplete = !0, i.$slide.siblings().trigger("onReset"), t.preload("inline"), v(i.$slide), i.$slide.addClass("fancybox-slide--complete"), n.each(t.slides, function (e, i) {
							i.pos >= t.currPos - 1 && i.pos <= t.currPos + 1 ? r[i.pos] = i : i && (n.fancybox.stop(i.$slide), i.$slide.off().remove())
						}), t.slides = r), t.isAnimating = !1, t.updateCursor(), t.trigger("afterShow"), i.opts.video.autoStart && i.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function () {
							Document.exitFullscreen ? Document.exitFullscreen() : this.webkitExitFullscreen && this.webkitExitFullscreen(), t.next()
						}), i.opts.autoFocus && "html" === i.contentType && ((e = i.$content.find("input[autofocus]:enabled:visible:first")).length ? e.trigger("focus") : t.focus(null, !0)), i.$slide.scrollTop(0).scrollLeft(0))
					},
					preload: function (e) {
						var t, n, i = this;
						i.group.length < 2 || (n = i.slides[i.currPos + 1], (t = i.slides[i.currPos - 1]) && t.type === e && i.loadSlide(t), n && n.type === e && i.loadSlide(n))
					},
					focus: function (e, i) {
						var r, o, s = this,
							a = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'].join(",");
						s.isClosing || ((r = (r = !e && s.current && s.current.isComplete ? s.current.$slide.find("*:visible" + (i ? ":not(.fancybox-close-small)" : "")) : s.$refs.container.find("*:visible")).filter(a).filter(function () {
							return "hidden" !== n(this).css("visibility") && !n(this).hasClass("disabled")
						})).length ? (o = r.index(t.activeElement), e && e.shiftKey ? (o < 0 || 0 == o) && (e.preventDefault(), r.eq(r.length - 1).trigger("focus")) : (o < 0 || o == r.length - 1) && (e && e.preventDefault(), r.eq(0).trigger("focus"))) : s.$refs.container.trigger("focus"))
					},
					activate: function () {
						var e = this;
						n(".fancybox-container").each(function () {
							var t = n(this).data("FancyBox");
							t && t.id !== e.id && !t.isClosing && (t.trigger("onDeactivate"), t.removeEvents(), t.isVisible = !1)
						}), e.isVisible = !0, (e.current || e.isIdle) && (e.update(), e.updateControls()), e.trigger("onActivate"), e.addEvents()
					},
					close: function (e, t) {
						var i, r, o, s, a, c, l, d = this,
							u = d.current,
							p = function () {
								d.cleanUp(e)
							};
						return !d.isClosing && (d.isClosing = !0, !1 === d.trigger("beforeClose", e) ? (d.isClosing = !1, h(function () {
							d.update()
						}), !1) : (d.removeEvents(), o = u.$content, i = u.opts.animationEffect, r = n.isNumeric(t) ? t : i ? u.opts.animationDuration : 0, u.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"), !0 !== e ? n.fancybox.stop(u.$slide) : i = !1, u.$slide.siblings().trigger("onReset").remove(), r && d.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", r + "ms"), d.hideLoading(u), d.hideControls(!0), d.updateCursor(), "zoom" !== i || o && r && "image" === u.type && !d.isMoved() && !u.hasError && (l = d.getThumbPos(u)) || (i = "fade"), "zoom" === i ? (n.fancybox.stop(o), c = {
							top: (s = n.fancybox.getTranslate(o)).top,
							left: s.left,
							scaleX: s.width / l.width,
							scaleY: s.height / l.height,
							width: l.width,
							height: l.height
						}, "auto" == (a = u.opts.zoomOpacity) && (a = Math.abs(u.width / u.height - l.width / l.height) > .1), a && (l.opacity = 0), n.fancybox.setTranslate(o, c), v(o), n.fancybox.animate(o, l, r, p), !0) : (i && r ? n.fancybox.animate(u.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"), "fancybox-animated fancybox-fx-" + i, r, p) : !0 === e ? setTimeout(p, r) : p(), !0)))
					},
					cleanUp: function (t) {
						var i, r, o, s = this,
							a = s.current.opts.$orig;
						s.current.$slide.trigger("onReset"), s.$refs.container.empty().remove(), s.trigger("afterClose", t), s.current.opts.backFocus && (a && a.length && a.is(":visible") || (a = s.$trigger), a && a.length && (r = e.scrollX, o = e.scrollY, a.trigger("focus"), n("html, body").scrollTop(o).scrollLeft(r))), s.current = null, (i = n.fancybox.getInstance()) ? i.activate() : (n("body").removeClass("fancybox-active compensate-for-scrollbar"), n("#fancybox-style-noscroll").remove())
					},
					trigger: function (e, t) {
						var i, r = Array.prototype.slice.call(arguments, 1),
							o = this,
							s = t && t.opts ? t : o.current;
						if (s ? r.unshift(s) : s = o,
							r.unshift(o), n.isFunction(s.opts[e]) && (i = s.opts[e].apply(s, r)), !1 === i) return i;
						"afterClose" !== e && o.$refs ? o.$refs.container.trigger(e + ".fb", r) : u.trigger(e + ".fb", r)
					},
					updateControls: function () {
						var e = this,
							i = e.current,
							r = i.index,
							o = e.$refs.container,
							s = e.$refs.caption,
							a = i.opts.caption;
						i.$slide.trigger("refresh"), a && a.length ? (e.$caption = s, s.children().eq(0).html(a)) : e.$caption = null, e.hasHiddenControls || e.isIdle || e.showControls(), o.find("[data-fancybox-count]").html(e.group.length), o.find("[data-fancybox-index]").html(r + 1), o.find("[data-fancybox-prev]").prop("disabled", !i.opts.loop && r <= 0), o.find("[data-fancybox-next]").prop("disabled", !i.opts.loop && r >= e.group.length - 1), "image" === i.type ? o.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", i.opts.image.src || i.src).show() : i.opts.toolbar && o.find("[data-fancybox-download],[data-fancybox-zoom]").hide(), n(t.activeElement).is(":hidden,[disabled]") && e.$refs.container.trigger("focus")
					},
					hideControls: function (e) {
						var t = ["infobar", "toolbar", "nav"];
						!e && this.current.opts.preventCaptionOverlap || t.push("caption"), this.$refs.container.removeClass(t.map(function (e) {
							return "fancybox-show-" + e
						}).join(" ")), this.hasHiddenControls = !0
					},
					showControls: function () {
						var e = this,
							t = e.current ? e.current.opts : e.opts,
							n = e.$refs.container;
						e.hasHiddenControls = !1, e.idleSecondsCounter = 0, n.toggleClass("fancybox-show-toolbar", !(!t.toolbar || !t.buttons)).toggleClass("fancybox-show-infobar", !!(t.infobar && e.group.length > 1)).toggleClass("fancybox-show-caption", !!e.$caption).toggleClass("fancybox-show-nav", !!(t.arrows && e.group.length > 1)).toggleClass("fancybox-is-modal", !!t.modal)
					},
					toggleControls: function () {
						this.hasHiddenControls ? this.showControls() : this.hideControls()
					}
				}), n.fancybox = {
					version: "3.5.7",
					defaults: l,
					getInstance: function (e) {
						var t = n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),
							i = Array.prototype.slice.call(arguments, 1);
						return t instanceof b && ("string" === n.type(e) ? t[e].apply(t, i) : "function" === n.type(e) && e.apply(t, i), t)
					},
					open: function (e, t, n) {
						return new b(e, t, n)
					},
					close: function (e) {
						var t = this.getInstance();
						t && (t.close(), !0 === e && this.close(e))
					},
					destroy: function () {
						this.close(!0), u.add("body").off("click.fb-start", "**")
					},
					isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
					use3d: (o = t.createElement("div"), e.getComputedStyle && e.getComputedStyle(o) && e.getComputedStyle(o).getPropertyValue("transform") && !(t.documentMode && t.documentMode < 11)),
					getTranslate: function (e) {
						var t;
						return !(!e || !e.length) && {
							top: (t = e[0].getBoundingClientRect()).top || 0,
							left: t.left || 0,
							width: t.width,
							height: t.height,
							opacity: parseFloat(e.css("opacity"))
						}
					},
					setTranslate: function (e, t) {
						var n = "",
							r = {};
						if (e && t) return t.left === i && t.top === i || (n = (t.left === i ? e.position().left : t.left) + "px, " + (t.top === i ? e.position().top : t.top) + "px", n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"), t.scaleX !== i && t.scaleY !== i ? n += " scale(" + t.scaleX + ", " + t.scaleY + ")" : t.scaleX !== i && (n += " scaleX(" + t.scaleX + ")"), n.length && (r.transform = n), t.opacity !== i && (r.opacity = t.opacity), t.width !== i && (r.width = t.width), t.height !== i && (r.height = t.height), e.css(r)
					},
					animate: function (e, t, r, o, s) {
						var a, c = this;
						n.isFunction(r) && (o = r, r = null), c.stop(e), a = c.getTranslate(e), e.on(g, function (l) {
							(!l || !l.originalEvent || e.is(l.originalEvent.target) && "z-index" != l.originalEvent.propertyName) && (c.stop(e), n.isNumeric(r) && e.css("transition-duration", ""), n.isPlainObject(t) ? t.scaleX !== i && t.scaleY !== i && c.setTranslate(e, {
								top: t.top,
								left: t.left,
								width: a.width * t.scaleX,
								height: a.height * t.scaleY,
								scaleX: 1,
								scaleY: 1
							}) : !0 !== s && e.removeClass(t), n.isFunction(o) && o(l))
						}), n.isNumeric(r) && e.css("transition-duration", r + "ms"), n.isPlainObject(t) ? (t.scaleX !== i && t.scaleY !== i && (delete t.width, delete t.height, e.parent().hasClass("fancybox-slide--image") && e.parent().addClass("fancybox-is-scaling")), n.fancybox.setTranslate(e, t)) : e.addClass(t), e.data("timer", setTimeout(function () {
							e.trigger(g)
						}, r + 33))
					},
					stop: function (e, t) {
						e && e.length && (clearTimeout(e.data("timer")), t && e.trigger(g), e.off(g).css("transition-duration", ""), e.parent().removeClass("fancybox-is-scaling"))
					}
				}, n.fn.fancybox = function (e) {
					var t;
					return (t = (e = e || {}).selector || !1) ? n("body").off("click.fb-start", t).on("click.fb-start", t, {
						options: e
					}, r) : this.off("click.fb-start").on("click.fb-start", {
						items: this,
						options: e
					}, r), this
				}, u.on("click.fb-start", "[data-fancybox]", r), u.on("click.fb-start", "[data-fancybox-trigger]", function () {
					n('[data-fancybox="' + n(this).attr("data-fancybox-trigger") + '"]').eq(n(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", {
						$trigger: n(this)
					})
				}), s = ".fancybox-button", a = "fancybox-focus", c = null, u.on("mousedown mouseup focus blur", s, function (e) {
					switch (e.type) {
						case "mousedown":
							c = n(this);
							break;
						case "mouseup":
							c = null;
							break;
						case "focusin":
							n(s).removeClass(a), n(this).is(c) || n(this).is("[disabled]") || n(this).addClass(a);
							break;
						case "focusout":
							n(s).removeClass(a)
					}
				})
			}
	}(window, document, jQuery),
	function (e) {
		"use strict";
		var t = {
				youtube: {
					matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
					params: {
						autoplay: 1,
						autohide: 1,
						fs: 1,
						rel: 0,
						hd: 1,
						wmode: "transparent",
						enablejsapi: 1,
						html5: 1
					},
					paramPlace: 8,
					type: "iframe",
					url: "https://www.youtube-nocookie.com/embed/$4",
					thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg"
				},
				vimeo: {
					matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
					params: {
						autoplay: 1,
						hd: 1,
						show_title: 1,
						show_byline: 1,
						show_portrait: 0,
						fullscreen: 1
					},
					paramPlace: 3,
					type: "iframe",
					url: "//player.vimeo.com/video/$2"
				},
				instagram: {
					matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
					type: "image",
					url: "//$1/p/$2/media/?size=l"
				},
				gmap_place: {
					matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
					type: "iframe",
					url: function (e) {
						return "//maps.google." + e[2] + "/?ll=" + (e[9] ? e[9] + "&z=" + Math.floor(e[10]) + (e[12] ? e[12].replace(/^\//, "&") : "") : e[12] + "").replace(/\?/, "&") + "&output=" + (e[12] && e[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
					}
				},
				gmap_search: {
					matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
					type: "iframe",
					url: function (e) {
						return "//maps.google." + e[2] + "/maps?q=" + e[5].replace("query=", "q=").replace("api=1", "") + "&output=embed"
					}
				}
			},
			n = function (t, n, i) {
				if (t) return i = i || "", "object" === e.type(i) && (i = e.param(i, !0)), e.each(n, function (e, n) {
					t = t.replace("$" + e, n || "")
				}), i.length && (t += (t.indexOf("?") > 0 ? "&" : "?") + i), t
			};
		e(document).on("objectNeedsType.fb", function (i, r, o) {
			var s, a, c, l, d, u, p, f = o.src || "",
				h = !1;
			s = e.extend(!0, {}, t, o.opts.media), e.each(s, function (t, i) {
				if (c = f.match(i.matcher)) {
					if (h = i.type, p = t, u = {}, i.paramPlace && c[i.paramPlace]) {
						"?" == (d = c[i.paramPlace])[0] && (d = d.substring(1)), d = d.split("&");
						for (var r = 0; r < d.length; ++r) {
							var s = d[r].split("=", 2);
							2 == s.length && (u[s[0]] = decodeURIComponent(s[1].replace(/\+/g, " ")))
						}
					}
					return l = e.extend(!0, {}, i.params, o.opts[t], u), f = "function" === e.type(i.url) ? i.url.call(this, c, l, o) : n(i.url, c, l), a = "function" === e.type(i.thumb) ? i.thumb.call(this, c, l, o) : n(i.thumb, c), "youtube" === t ? f = f.replace(/&t=((\d+)m)?(\d+)s/, function (e, t, n, i) {
						return "&start=" + ((n ? 60 * parseInt(n, 10) : 0) + parseInt(i, 10))
					}) : "vimeo" === t && (f = f.replace("&%23", "#")), !1
				}
			}), h ? (o.opts.thumb || o.opts.$thumb && o.opts.$thumb.length || (o.opts.thumb = a), "iframe" === h && (o.opts = e.extend(!0, o.opts, {
				iframe: {
					preload: !1,
					attr: {
						scrolling: "no"
					}
				}
			})), e.extend(o, {
				type: h,
				src: f,
				origSrc: o.src,
				contentSource: p,
				contentType: "image" === h ? "image" : "gmap_place" == p || "gmap_search" == p ? "map" : "video"
			})) : f && (o.type = o.opts.defaultType)
		});
		var i = {
			youtube: {
				src: "https://www.youtube.com/iframe_api",
				"class": "YT",
				loading: !1,
				loaded: !1
			},
			vimeo: {
				src: "https://player.vimeo.com/api/player.js",
				"class": "Vimeo",
				loading: !1,
				loaded: !1
			},
			load: function (e) {
				var t, n = this;
				this[e].loaded ? setTimeout(function () {
					n.done(e)
				}) : this[e].loading || (this[e].loading = !0, (t = document.createElement("script")).type = "text/javascript", t.src = this[e].src, "youtube" === e ? window.onYouTubeIframeAPIReady = function () {
					n[e].loaded = !0, n.done(e)
				} : t.onload = function () {
					n[e].loaded = !0, n.done(e)
				}, document.body.appendChild(t))
			},
			done: function (t) {
				var n, i;
				"youtube" === t && delete window.onYouTubeIframeAPIReady, (n = e.fancybox.getInstance()) && (i = n.current.$content.find("iframe"), "youtube" === t && YT !== undefined && YT ? new YT.Player(i.attr("id"), {
					events: {
						onStateChange: function (e) {
							0 == e.data && n.next()
						}
					}
				}) : "vimeo" === t && Vimeo !== undefined && Vimeo && new Vimeo.Player(i).on("ended", function () {
					n.next()
				}))
			}
		};
		e(document).on({
			"afterShow.fb": function (e, t, n) {
				t.group.length > 1 && ("youtube" === n.contentSource || "vimeo" === n.contentSource) && i.load(n.contentSource)
			}
		})
	}(jQuery),
	function (e, t, n) {
		"use strict";
		var i = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || function (t) {
				return e.setTimeout(t, 1e3 / 60)
			},
			r = e.cancelAnimationFrame || e.webkitCancelAnimationFrame || e.mozCancelAnimationFrame || e.oCancelAnimationFrame || function (t) {
				e.clearTimeout(t)
			},
			o = function (t) {
				var n = [];
				for (var i in t = (t = t.originalEvent || t || e.e).touches && t.touches.length ? t.touches : t.changedTouches && t.changedTouches.length ? t.changedTouches : [t]) t[i].pageX ? n.push({
					x: t[i].pageX,
					y: t[i].pageY
				}) : t[i].clientX && n.push({
					x: t[i].clientX,
					y: t[i].clientY
				});
				return n
			},
			s = function (e, t, n) {
				return t && e ? "x" === n ? e.x - t.x : "y" === n ? e.y - t.y : Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)) : 0
			},
			a = function (e) {
				if (e.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || n.isFunction(e.get(0).onclick) || e.data("selectable")) return !0;
				for (var t = 0, i = e[0].attributes, r = i.length; t < r; t++)
					if ("data-fancybox-" === i[t].nodeName.substr(0, 14)) return !0;
				return !1
			},
			c = function (t) {
				var n = e.getComputedStyle(t)["overflow-y"],
					i = e.getComputedStyle(t)["overflow-x"],
					r = ("scroll" === n || "auto" === n) && t.scrollHeight > t.clientHeight,
					o = ("scroll" === i || "auto" === i) && t.scrollWidth > t.clientWidth;
				return r || o
			},
			l = function (e) {
				for (var t = !1; !(t = c(e.get(0))) && (e = e.parent()).length && !e.hasClass("fancybox-stage") && !e.is("body"););
				return t
			},
			d = function (e) {
				var t = this;
				t.instance = e, t.$bg = e.$refs.bg, t.$stage = e.$refs.stage, t.$container = e.$refs.container, t.destroy(), t.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(t, "ontouchstart"))
			};
		d.prototype.destroy = function () {
			var e = this;
			e.$container.off(".fb.touch"), n(t).off(".fb.touch"), e.requestId && (r(e.requestId), e.requestId = null), e.tapped && (clearTimeout(e.tapped), e.tapped = null)
		}, d.prototype.ontouchstart = function (i) {
			var r = this,
				c = n(i.target),
				d = r.instance,
				u = d.current,
				p = u.$slide,
				f = u.$content,
				h = "touchstart" == i.type;
			if (h && r.$container.off("mousedown.fb.touch"), (!i.originalEvent || 2 != i.originalEvent.button) && p.length && c.length && !a(c) && !a(c.parent()) && (c.is("img") || !(i.originalEvent.clientX > c[0].clientWidth + c.offset().left))) {
				if (!u || d.isAnimating || u.$slide.hasClass("fancybox-animated")) return i.stopPropagation(), void i.preventDefault();
				r.realPoints = r.startPoints = o(i), r.startPoints.length && (u.touch && i.stopPropagation(), r.startEvent = i, r.canTap = !0, r.$target = c, r.$content = f, r.opts = u.opts.touch, r.isPanning = !1, r.isSwiping = !1, r.isZooming = !1, r.isScrolling = !1, r.canPan = d.canPan(), r.startTime = (new Date).getTime(), r.distanceX = r.distanceY = r.distance = 0, r.canvasWidth = Math.round(p[0].clientWidth), r.canvasHeight = Math.round(p[0].clientHeight), r.contentLastPos = null, r.contentStartPos = n.fancybox.getTranslate(r.$content) || {
					top: 0,
					left: 0
				}, r.sliderStartPos = n.fancybox.getTranslate(p), r.stagePos = n.fancybox.getTranslate(d.$refs.stage), r.sliderStartPos.top -= r.stagePos.top, r.sliderStartPos.left -= r.stagePos.left, r.contentStartPos.top -= r.stagePos.top, r.contentStartPos.left -= r.stagePos.left, n(t).off(".fb.touch").on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(r, "ontouchend")).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(r, "ontouchmove")), n.fancybox.isMobile && t.addEventListener("scroll", r.onscroll, !0), ((r.opts || r.canPan) && (c.is(r.$stage) || r.$stage.find(c).length) || (c.is(".fancybox-image") && i.preventDefault(), n.fancybox.isMobile && c.parents(".fancybox-caption").length)) && (r.isScrollable = l(c) || l(c.parent()), n.fancybox.isMobile && r.isScrollable || i.preventDefault(), (1 === r.startPoints.length || u.hasError) && (r.canPan ? (n.fancybox.stop(r.$content), r.isPanning = !0) : r.isSwiping = !0, r.$container.addClass("fancybox-is-grabbing")), 2 === r.startPoints.length && "image" === u.type && (u.isLoaded || u.$ghost) && (r.canTap = !1, r.isSwiping = !1, r.isPanning = !1, r.isZooming = !0, n.fancybox.stop(r.$content), r.centerPointStartX = .5 * (r.startPoints[0].x + r.startPoints[1].x) - n(e).scrollLeft(), r.centerPointStartY = .5 * (r.startPoints[0].y + r.startPoints[1].y) - n(e).scrollTop(), r.percentageOfImageAtPinchPointX = (r.centerPointStartX - r.contentStartPos.left) / r.contentStartPos.width, r.percentageOfImageAtPinchPointY = (r.centerPointStartY - r.contentStartPos.top) / r.contentStartPos.height, r.startDistanceBetweenFingers = s(r.startPoints[0], r.startPoints[1]))))
			}
		}, d.prototype.onscroll = function () {
			var e = this;
			e.isScrolling = !0, t.removeEventListener("scroll", e.onscroll, !0)
		}, d.prototype.ontouchmove = function (e) {
			var t = this;
			e.originalEvent.buttons === undefined || 0 !== e.originalEvent.buttons ? t.isScrolling ? t.canTap = !1 : (t.newPoints = o(e), (t.opts || t.canPan) && t.newPoints.length && t.newPoints.length && (t.isSwiping && !0 === t.isSwiping || e.preventDefault(), t.distanceX = s(t.newPoints[0], t.startPoints[0], "x"), t.distanceY = s(t.newPoints[0], t.startPoints[0], "y"), t.distance = s(t.newPoints[0], t.startPoints[0]), t.distance > 0 && (t.isSwiping ? t.onSwipe(e) : t.isPanning ? t.onPan() : t.isZooming && t.onZoom()))) : t.ontouchend(e)
		}, d.prototype.onSwipe = function () {
			var t, o = this,
				s = o.instance,
				a = o.isSwiping,
				c = o.sliderStartPos.left || 0;
			if (!0 !== a) "x" == a && (o.distanceX > 0 && (o.instance.group.length < 2 || 0 === o.instance.current.index && !o.instance.current.opts.loop) ? c += Math.pow(o.distanceX, .8) : o.distanceX < 0 && (o.instance.group.length < 2 || o.instance.current.index === o.instance.group.length - 1 && !o.instance.current.opts.loop) ? c -= Math.pow(-o.distanceX, .8) : c += o.distanceX), o.sliderLastPos = {
				top: "x" == a ? 0 : o.sliderStartPos.top + o.distanceY,
				left: c
			}, o.requestId && (r(o.requestId), o.requestId = null), o.requestId = i(function () {
				o.sliderLastPos && (n.each(o.instance.slides, function (e, t) {
					var i = t.pos - o.instance.currPos;
					n.fancybox.setTranslate(t.$slide, {
						top: o.sliderLastPos.top,
						left: o.sliderLastPos.left + i * o.canvasWidth + i * t.opts.gutter
					})
				}), o.$container.addClass("fancybox-is-sliding"))
			});
			else if (Math.abs(o.distance) > 10) {
				if (o.canTap = !1, s.group.length < 2 && o.opts.vertical ? o.isSwiping = "y" : s.isDragging || !1 === o.opts.vertical || "auto" === o.opts.vertical && n(e).width() > 800 ? o.isSwiping = "x" : (t = Math.abs(180 * Math.atan2(o.distanceY, o.distanceX) / Math.PI), o.isSwiping = t > 45 && t < 135 ? "y" : "x"), "y" === o.isSwiping && n.fancybox.isMobile && o.isScrollable) return void(o.isScrolling = !0);
				s.isDragging = o.isSwiping, o.startPoints = o.newPoints, n.each(s.slides, function (e, t) {
					var i, r;
					n.fancybox.stop(t.$slide), i = n.fancybox.getTranslate(t.$slide), r = n.fancybox.getTranslate(s.$refs.stage), t.$slide.css({
						transform: "",
						opacity: "",
						"transition-duration": ""
					}).removeClass("fancybox-animated").removeClass(function (e, t) {
						return (t.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ")
					}), t.pos === s.current.pos && (o.sliderStartPos.top = i.top - r.top, o.sliderStartPos.left = i.left - r.left), n.fancybox.setTranslate(t.$slide, {
						top: i.top - r.top,
						left: i.left - r.left
					})
				}), s.SlideShow && s.SlideShow.isActive && s.SlideShow.stop()
			}
		}, d.prototype.onPan = function () {
			var e = this;
			s(e.newPoints[0], e.realPoints[0]) < (n.fancybox.isMobile ? 10 : 5) ? e.startPoints = e.newPoints : (e.canTap = !1, e.contentLastPos = e.limitMovement(), e.requestId && r(e.requestId), e.requestId = i(function () {
				n.fancybox.setTranslate(e.$content, e.contentLastPos)
			}))
		}, d.prototype.limitMovement = function () {
			var e, t, n, i, r, o, s = this,
				a = s.canvasWidth,
				c = s.canvasHeight,
				l = s.distanceX,
				d = s.distanceY,
				u = s.contentStartPos,
				p = u.left,
				f = u.top,
				h = u.width,
				m = u.height;
			return r = h > a ? p + l : p, o = f + d, e = Math.max(0, .5 * a - .5 * h), t = Math.max(0, .5 * c - .5 * m), n = Math.min(a - h, .5 * a - .5 * h), i = Math.min(c - m, .5 * c - .5 * m), l > 0 && r > e && (r = e - 1 + Math.pow(-e + p + l, .8) || 0), l < 0 && r < n && (r = n + 1 - Math.pow(n - p - l, .8) || 0), d > 0 && o > t && (o = t - 1 + Math.pow(-t + f + d, .8) || 0), d < 0 && o < i && (o = i + 1 - Math.pow(i - f - d, .8) || 0), {
				top: o,
				left: r
			}
		}, d.prototype.limitPosition = function (e, t, n, i) {
			var r = this,
				o = r.canvasWidth,
				s = r.canvasHeight;
			return e = n > o ? (e = e > 0 ? 0 : e) < o - n ? o - n : e : Math.max(0, o / 2 - n / 2), {
				top: t = i > s ? (t = t > 0 ? 0 : t) < s - i ? s - i : t : Math.max(0, s / 2 - i / 2),
				left: e
			}
		}, d.prototype.onZoom = function () {
			var t = this,
				o = t.contentStartPos,
				a = o.width,
				c = o.height,
				l = o.left,
				d = o.top,
				u = s(t.newPoints[0], t.newPoints[1]) / t.startDistanceBetweenFingers,
				p = Math.floor(a * u),
				f = Math.floor(c * u),
				h = (a - p) * t.percentageOfImageAtPinchPointX,
				m = (c - f) * t.percentageOfImageAtPinchPointY,
				g = (t.newPoints[0].x + t.newPoints[1].x) / 2 - n(e).scrollLeft(),
				v = (t.newPoints[0].y + t.newPoints[1].y) / 2 - n(e).scrollTop(),
				y = g - t.centerPointStartX,
				A = {
					top: d + (m + (v - t.centerPointStartY)),
					left: l + (h + y),
					scaleX: u,
					scaleY: u
				};
			t.canTap = !1, t.newWidth = p, t.newHeight = f, t.contentLastPos = A, t.requestId && r(t.requestId), t.requestId = i(function () {
				n.fancybox.setTranslate(t.$content, t.contentLastPos)
			})
		}, d.prototype.ontouchend = function (e) {
			var i = this,
				s = i.isSwiping,
				a = i.isPanning,
				c = i.isZooming,
				l = i.isScrolling;
			if (i.endPoints = o(e), i.dMs = Math.max((new Date).getTime() - i.startTime, 1), i.$container.removeClass("fancybox-is-grabbing"), n(t).off(".fb.touch"), t.removeEventListener("scroll", i.onscroll, !0), i.requestId && (r(i.requestId), i.requestId = null), i.isSwiping = !1, i.isPanning = !1, i.isZooming = !1, i.isScrolling = !1, i.instance.isDragging = !1, i.canTap) return i.onTap(e);
			i.speed = 100, i.velocityX = i.distanceX / i.dMs * .5, i.velocityY = i.distanceY / i.dMs * .5, a ? i.endPanning() : c ? i.endZooming() : i.endSwiping(s, l)
		}, d.prototype.endSwiping = function (e, t) {
			var i = this,
				r = !1,
				o = i.instance.group.length,
				s = Math.abs(i.distanceX),
				a = "x" == e && o > 1 && (i.dMs > 130 && s > 10 || s > 50),
				c = 300;
			i.sliderLastPos = null, "y" == e && !t && Math.abs(i.distanceY) > 50 ? (n.fancybox.animate(i.instance.current.$slide, {
				top: i.sliderStartPos.top + i.distanceY + 150 * i.velocityY,
				opacity: 0
			}, 200), r = i.instance.close(!0, 250)) : a && i.distanceX > 0 ? r = i.instance.previous(c) : a && i.distanceX < 0 && (r = i.instance.next(c)), !1 !== r || "x" != e && "y" != e || i.instance.centerSlide(200), i.$container.removeClass("fancybox-is-sliding")
		}, d.prototype.endPanning = function () {
			var e, t, i, r = this;
			r.contentLastPos && (!1 === r.opts.momentum || r.dMs > 350 ? (e = r.contentLastPos.left, t = r.contentLastPos.top) : (e = r.contentLastPos.left + 500 * r.velocityX, t = r.contentLastPos.top + 500 * r.velocityY), (i = r.limitPosition(e, t, r.contentStartPos.width, r.contentStartPos.height)).width = r.contentStartPos.width, i.height = r.contentStartPos.height, n.fancybox.animate(r.$content, i, 366))
		}, d.prototype.endZooming = function () {
			var e, t, i, r, o = this,
				s = o.instance.current,
				a = o.newWidth,
				c = o.newHeight;
			o.contentLastPos && (e = o.contentLastPos.left, r = {
				top: t = o.contentLastPos.top,
				left: e,
				width: a,
				height: c,
				scaleX: 1,
				scaleY: 1
			}, n.fancybox.setTranslate(o.$content, r), a < o.canvasWidth && c < o.canvasHeight ? o.instance.scaleToFit(150) : a > s.width || c > s.height ? o.instance.scaleToActual(o.centerPointStartX, o.centerPointStartY, 150) : (i = o.limitPosition(e, t, a, c), n.fancybox.animate(o.$content, i, 150)))
		}, d.prototype.onTap = function (t) {
			var i, r = this,
				s = n(t.target),
				a = r.instance,
				c = a.current,
				l = t && o(t) || r.startPoints,
				d = l[0] ? l[0].x - n(e).scrollLeft() - r.stagePos.left : 0,
				u = l[0] ? l[0].y - n(e).scrollTop() - r.stagePos.top : 0,
				p = function (e) {
					var i = c.opts[e];
					if (n.isFunction(i) && (i = i.apply(a, [c, t])), i) switch (i) {
						case "close":
							a.close(r.startEvent);
							break;
						case "toggleControls":
							a.toggleControls();
							break;
						case "next":
							a.next();
							break;
						case "nextOrClose":
							a.group.length > 1 ? a.next() : a.close(r.startEvent);
							break;
						case "zoom":
							"image" == c.type && (c.isLoaded || c.$ghost) && (a.canPan() ? a.scaleToFit() : a.isScaledDown() ? a.scaleToActual(d, u) : a.group.length < 2 && a.close(r.startEvent))
					}
				};
			if ((!t.originalEvent || 2 != t.originalEvent.button) && (s.is("img") || !(d > s[0].clientWidth + s.offset().left))) {
				if (s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) i = "Outside";
				else if (s.is(".fancybox-slide")) i = "Slide";
				else {
					if (!a.current.$content || !a.current.$content.find(s).addBack().filter(s).length) return;
					i = "Content"
				}
				if (r.tapped) {
					if (clearTimeout(r.tapped), r.tapped = null, Math.abs(d - r.tapX) > 50 || Math.abs(u - r.tapY) > 50) return this;
					p("dblclick" + i)
				} else r.tapX = d, r.tapY = u, c.opts["dblclick" + i] && c.opts["dblclick" + i] !== c.opts["click" + i] ? r.tapped = setTimeout(function () {
					r.tapped = null, a.isAnimating || p("click" + i)
				}, 500) : p("click" + i);
				return this
			}
		}, n(t).on("onActivate.fb", function (e, t) {
			t && !t.Guestures && (t.Guestures = new d(t))
		}).on("beforeClose.fb", function (e, t) {
			t && t.Guestures && t.Guestures.destroy()
		})
	}(window, document, jQuery),
	function (e, t) {
		"use strict";
		t.extend(!0, t.fancybox.defaults, {
			btnTpl: {
				slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'
			},
			slideShow: {
				autoStart: !1,
				speed: 3e3,
				progress: !0
			}
		});
		var n = function (e) {
			this.instance = e, this.init()
		};
		t.extend(n.prototype, {
			timer: null,
			isActive: !1,
			$button: null,
			init: function () {
				var e = this,
					n = e.instance,
					i = n.group[n.currIndex].opts.slideShow;
				e.$button = n.$refs.toolbar.find("[data-fancybox-play]").on("click", function () {
					e.toggle()
				}), n.group.length < 2 || !i ? e.$button.hide() : i.progress && (e.$progress = t('<div class="fancybox-progress"></div>').appendTo(n.$refs.inner))
			},
			set: function (e) {
				var n = this,
					i = n.instance,
					r = i.current;
				r && (!0 === e || r.opts.loop || i.currIndex < i.group.length - 1) ? n.isActive && "video" !== r.contentType && (n.$progress && t.fancybox.animate(n.$progress.show(), {
					scaleX: 1
				}, r.opts.slideShow.speed), n.timer = setTimeout(function () {
					i.current.opts.loop || i.current.index != i.group.length - 1 ? i.next() : i.jumpTo(0)
				}, r.opts.slideShow.speed)) : (n.stop(), i.idleSecondsCounter = 0, i.showControls())
			},
			clear: function () {
				var e = this;
				clearTimeout(e.timer), e.timer = null, e.$progress && e.$progress.removeAttr("style").hide()
			},
			start: function () {
				var e = this,
					t = e.instance.current;
				t && (e.$button.attr("title", (t.opts.i18n[t.opts.lang] || t.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"), e.isActive = !0, t.isComplete && e.set(!0), e.instance.trigger("onSlideShowChange", !0))
			},
			stop: function () {
				var e = this,
					t = e.instance.current;
				e.clear(), e.$button.attr("title", (t.opts.i18n[t.opts.lang] || t.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"), e.isActive = !1, e.instance.trigger("onSlideShowChange", !1), e.$progress && e.$progress.removeAttr("style").hide()
			},
			toggle: function () {
				var e = this;
				e.isActive ? e.stop() : e.start()
			}
		}), t(e).on({
			"onInit.fb": function (e, t) {
				t && !t.SlideShow && (t.SlideShow = new n(t))
			},
			"beforeShow.fb": function (e, t, n, i) {
				var r = t && t.SlideShow;
				i ? r && n.opts.slideShow.autoStart && r.start() : r && r.isActive && r.clear()
			},
			"afterShow.fb": function (e, t) {
				var n = t && t.SlideShow;
				n && n.isActive && n.set()
			},
			"afterKeydown.fb": function (n, i, r, o, s) {
				var a = i && i.SlideShow;
				!a || !r.opts.slideShow || 80 !== s && 32 !== s || t(e.activeElement).is("button,a,input") || (o.preventDefault(), a.toggle())
			},
			"beforeClose.fb onDeactivate.fb": function (e, t) {
				var n = t && t.SlideShow;
				n && n.stop()
			}
		}), t(e).on("visibilitychange", function () {
			var n = t.fancybox.getInstance(),
				i = n && n.SlideShow;
			i && i.isActive && (e.hidden ? i.clear() : i.set())
		})
	}(document, jQuery),
	function (e, t) {
		"use strict";
		var n = function () {
			for (var t = [
					["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
					["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
					["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
					["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
					["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
				], n = {}, i = 0; i < t.length; i++) {
				var r = t[i];
				if (r && r[1] in e) {
					for (var o = 0; o < r.length; o++) n[t[0][o]] = r[o];
					return n
				}
			}
			return !1
		}();
		if (n) {
			var i = {
				request: function (t) {
					(t = t || e.documentElement)[n.requestFullscreen](t.ALLOW_KEYBOARD_INPUT)
				},
				exit: function () {
					e[n.exitFullscreen]()
				},
				toggle: function (t) {
					t = t || e.documentElement, this.isFullscreen() ? this.exit() : this.request(t)
				},
				isFullscreen: function () {
					return Boolean(e[n.fullscreenElement])
				},
				enabled: function () {
					return Boolean(e[n.fullscreenEnabled])
				}
			};
			t.extend(!0, t.fancybox.defaults, {
				btnTpl: {
					fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'
				},
				fullScreen: {
					autoStart: !1
				}
			}), t(e).on(n.fullscreenchange, function () {
				var e = i.isFullscreen(),
					n = t.fancybox.getInstance();
				n && (n.current && "image" === n.current.type && n.isAnimating && (n.isAnimating = !1, n.update(!0, !0, 0), n.isComplete || n.complete()), n.trigger("onFullscreenChange", e), n.$refs.container.toggleClass("fancybox-is-fullscreen", e), n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter", !e).toggleClass("fancybox-button--fsexit", e))
			})
		}
		t(e).on({
			"onInit.fb": function (e, t) {
				n ? t && t.group[t.currIndex].opts.fullScreen ? (t.$refs.container.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function (e) {
					e.stopPropagation(), e.preventDefault(), i.toggle()
				}), t.opts.fullScreen && !0 === t.opts.fullScreen.autoStart && i.request(), t.FullScreen = i) : t && t.$refs.toolbar.find("[data-fancybox-fullscreen]").hide() : t.$refs.toolbar.find("[data-fancybox-fullscreen]").remove()
			},
			"afterKeydown.fb": function (e, t, n, i, r) {
				t && t.FullScreen && 70 === r && (i.preventDefault(), t.FullScreen.toggle())
			},
			"beforeClose.fb": function (e, t) {
				t && t.FullScreen && t.$refs.container.hasClass("fancybox-is-fullscreen") && i.exit()
			}
		})
	}(document, jQuery),
	function (e, t) {
		"use strict";
		var n = "fancybox-thumbs",
			i = n + "-active";
		t.fancybox.defaults = t.extend(!0, {
			btnTpl: {
				thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'
			},
			thumbs: {
				autoStart: !1,
				hideOnClose: !0,
				parentEl: ".fancybox-container",
				axis: "y"
			}
		}, t.fancybox.defaults);
		var r = function (e) {
			this.init(e)
		};
		t.extend(r.prototype, {
			$button: null,
			$grid: null,
			$list: null,
			isVisible: !1,
			isActive: !1,
			init: function (e) {
				var t = this,
					n = e.group,
					i = 0;
				t.instance = e, t.opts = n[e.currIndex].opts.thumbs, e.Thumbs = t, t.$button = e.$refs.toolbar.find("[data-fancybox-thumbs]");
				for (var r = 0, o = n.length; r < o && (n[r].thumb && i++, !(i > 1)); r++);
				i > 1 && t.opts ? (t.$button.removeAttr("style").on("click", function () {
					t.toggle()
				}), t.isActive = !0) : t.$button.hide()
			},
			create: function () {
				var e, i = this,
					r = i.instance,
					o = i.opts.parentEl,
					s = [];
				i.$grid || (i.$grid = t('<div class="' + n + " " + n + "-" + i.opts.axis + '"></div>').appendTo(r.$refs.container.find(o).addBack().filter(o)), i.$grid.on("click", "a", function () {
					r.jumpTo(t(this).attr("data-index"))
				})), i.$list || (i.$list = t('<div class="' + n + '__list">').appendTo(i.$grid)), t.each(r.group, function (t, n) {
					(e = n.thumb) || "image" !== n.type || (e = n.src), s.push('<a href="javascript:;" tabindex="0" data-index="' + t + '"' + (e && e.length ? ' style="background-image:url(' + e + ')"' : 'class="fancybox-thumbs-missing"') + "></a>")
				}), i.$list[0].innerHTML = s.join(""), "x" === i.opts.axis && i.$list.width(parseInt(i.$grid.css("padding-right"), 10) + r.group.length * i.$list.children().eq(0).outerWidth(!0))
			},
			focus: function (e) {
				var t, n, r = this,
					o = r.$list,
					s = r.$grid;
				r.instance.current && (n = (t = o.children().removeClass(i).filter('[data-index="' + r.instance.current.index + '"]').addClass(i)).position(), "y" === r.opts.axis && (n.top < 0 || n.top > o.height() - t.outerHeight()) ? o.stop().animate({
					scrollTop: o.scrollTop() + n.top
				}, e) : "x" === r.opts.axis && (n.left < s.scrollLeft() || n.left > s.scrollLeft() + (s.width() - t.outerWidth())) && o.parent().stop().animate({
					scrollLeft: n.left
				}, e))
			},
			update: function () {
				var e = this;
				e.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible), e.isVisible ? (e.$grid || e.create(), e.instance.trigger("onThumbsShow"), e.focus(0)) : e.$grid && e.instance.trigger("onThumbsHide"), e.instance.update()
			},
			hide: function () {
				this.isVisible = !1, this.update()
			},
			show: function () {
				this.isVisible = !0, this.update()
			},
			toggle: function () {
				this.isVisible = !this.isVisible, this.update()
			}
		}), t(e).on({
			"onInit.fb": function (e, t) {
				var n;
				t && !t.Thumbs && (n = new r(t)).isActive && !0 === n.opts.autoStart && n.show()
			},
			"beforeShow.fb": function (e, t, n, i) {
				var r = t && t.Thumbs;
				r && r.isVisible && r.focus(i ? 0 : 250)
			},
			"afterKeydown.fb": function (e, t, n, i, r) {
				var o = t && t.Thumbs;
				o && o.isActive && 71 === r && (i.preventDefault(), o.toggle())
			},
			"beforeClose.fb": function (e, t) {
				var n = t && t.Thumbs;
				n && n.isVisible && !1 !== n.opts.hideOnClose && n.$grid.hide()
			}
		})
	}(document, jQuery),
	function (e, t) {
		"use strict";

		function n(e) {
			var t = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
				"/": "&#x2F;",
				"`": "&#x60;",
				"=": "&#x3D;"
			};
			return String(e).replace(/[&<>"'`=\/]/g, function (e) {
				return t[e]
			})
		}
		t.extend(!0, t.fancybox.defaults, {
			btnTpl: {
				share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'
			},
			share: {
				url: function (e, t) {
					return !e.currentHash && "inline" !== t.type && "html" !== t.type && (t.origSrc || t.src) || window.location
				},
				tpl: '<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'
			}
		}), t(e).on("click", "[data-fancybox-share]", function () {
			var e, i, r = t.fancybox.getInstance(),
				o = r.current || null;
			o && ("function" === t.type(o.opts.share.url) && (e = o.opts.share.url.apply(o, [r, o])), i = o.opts.share.tpl.replace(/\{\{media\}\}/g, "image" === o.type ? encodeURIComponent(o.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(e)).replace(/\{\{url_raw\}\}/g, n(e)).replace(/\{\{descr\}\}/g, r.$caption ? encodeURIComponent(r.$caption.text()) : ""), t.fancybox.open({
				src: r.translate(r, i),
				type: "html",
				opts: {
					touch: !1,
					animationEffect: !1,
					afterLoad: function (e, t) {
						r.$refs.container.one("beforeClose.fb", function () {
							e.close(null, 0)
						}), t.$content.find(".fancybox-share__button").click(function () {
							return window.open(this.href, "Share", "width=550, height=450"), !1
						})
					},
					mobile: {
						autoFocus: !1
					}
				}
			}))
		})
	}(document, jQuery),
	function (e, t, n) {
		"use strict";

		function i() {
			var t = e.location.hash.substr(1),
				n = t.split("-"),
				i = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) && parseInt(n.pop(-1), 10) || 1;
			return {
				hash: t,
				index: i < 1 ? 1 : i,
				gallery: n.join("-")
			}
		}

		function r(e) {
			"" !== e.gallery && n("[data-fancybox='" + n.escapeSelector(e.gallery) + "']").eq(e.index - 1).focus().trigger("click.fb-start")
		}

		function o(e) {
			var t, n;
			return !!e && ("" !== (n = (t = e.current ? e.current.opts : e.opts).hash || (t.$orig ? t.$orig.data("fancybox") || t.$orig.data("fancybox-trigger") : "")) && n)
		}
		n.escapeSelector || (n.escapeSelector = function (e) {
				var t = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
					n = function (e, t) {
						return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
					};
				return (e + "").replace(t, n)
			}),
			n(function () {
				!1 !== n.fancybox.defaults.hash && (n(t).on({
					"onInit.fb": function (e, t) {
						var n, r;
						!1 !== t.group[t.currIndex].opts.hash && (n = i(), (r = o(t)) && n.gallery && r == n.gallery && (t.currIndex = n.index - 1))
					},
					"beforeShow.fb": function (n, i, r, s) {
						var a;
						r && !1 !== r.opts.hash && (a = o(i)) && (i.currentHash = a + (i.group.length > 1 ? "-" + (r.index + 1) : ""), e.location.hash !== "#" + i.currentHash && (s && !i.origHash && (i.origHash = e.location.hash), i.hashTimer && clearTimeout(i.hashTimer), i.hashTimer = setTimeout(function () {
							"replaceState" in e.history ? (e.history[s ? "pushState" : "replaceState"]({}, t.title, e.location.pathname + e.location.search + "#" + i.currentHash), s && (i.hasCreatedHistory = !0)) : e.location.hash = i.currentHash, i.hashTimer = null
						}, 300)))
					},
					"beforeClose.fb": function (n, i, r) {
						r && !1 !== r.opts.hash && (clearTimeout(i.hashTimer), i.currentHash && i.hasCreatedHistory ? e.history.back() : i.currentHash && ("replaceState" in e.history ? e.history.replaceState({}, t.title, e.location.pathname + e.location.search + (i.origHash || "")) : e.location.hash = i.origHash), i.currentHash = null)
					}
				}), n(e).on("hashchange.fb", function () {
					var e = i(),
						t = null;
					n.each(n(".fancybox-container").get().reverse(), function (e, i) {
						var r = n(i).data("FancyBox");
						if (r && r.currentHash) return t = r, !1
					}), t ? t.currentHash === e.gallery + "-" + e.index || 1 === e.index && t.currentHash == e.gallery || (t.currentHash = null, t.close()) : "" !== e.gallery && r(e)
				}), setTimeout(function () {
					n.fancybox.getInstance() || r(i())
				}, 50))
			})
	}(window, document, jQuery),
	function (e, t) {
		"use strict";
		var n = (new Date).getTime();
		t(e).on({
			"onInit.fb": function (e, t) {
				t.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function (e) {
					var i = t.current,
						r = (new Date).getTime();
					t.group.length < 2 || !1 === i.opts.wheel || "auto" === i.opts.wheel && "image" !== i.type || (e.preventDefault(), e.stopPropagation(), i.$slide.hasClass("fancybox-animated") || (e = e.originalEvent || e, r - n < 250 || (n = r, t[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]())))
				})
			}
		})
	}(document, jQuery),
	function (e) {
		if ("function" == typeof bootstrap) bootstrap("hark", e);
		else if ("object" == typeof exports) module.exports = e();
		else if ("function" == typeof define && define.amd) define(e);
		else if ("undefined" != typeof ses) {
			if (!ses.ok()) return;
			ses.makeHark = e
		} else "undefined" != typeof window ? window.hark = e() : global.hark = e()
	}(function () {
		return function (e, t, n) {
			function i(n, o) {
				if (!t[n]) {
					if (!e[n]) {
						var s = "function" == typeof require && require;
						if (!o && s) return s(n, !0);
						if (r) return r(n, !0);
						throw new Error("Cannot find module '" + n + "'")
					}
					var a = t[n] = {
						exports: {}
					};
					e[n][0].call(a.exports, function (t) {
						var r = e[n][1][t];
						return i(r || t)
					}, a, a.exports)
				}
				return t[n].exports
			}
			for (var r = "function" == typeof require && require, o = 0; o < n.length; o++) i(n[o]);
			return i
		}({
			1: [function (e, t) {
				function n(e, t) {
					var n = -Infinity;
					e.getFloatFrequencyData(t);
					for (var i = 4, r = t.length; i < r; i++) t[i] > n && t[i] < 0 && (n = t[i]);
					return n
				}
				var i, r = e("wildemitter");
				"undefined" != typeof window && (i = window.AudioContext || window.webkitAudioContext);
				var o = null;
				t.exports = function (e, t) {
					var s = new r;
					if (!i) return s;
					var a, c, l, d = (t = t || {}).smoothing || .1,
						u = t.interval || 50,
						p = t.threshold,
						f = t.play,
						h = t.history || 10,
						m = !0;
					o || (o = new i), (l = o.createAnalyser()).fftSize = 512, l.smoothingTimeConstant = d, c = new Float32Array(l.frequencyBinCount), e.jquery && (e = e[0]), e instanceof HTMLAudioElement || e instanceof HTMLVideoElement ? (a = o.createMediaElementSource(e), void 0 === f && (f = !0), p = p || -50) : (a = o.createMediaStreamSource(e), p = p || -50), a.connect(l), f && l.connect(o.destination), s.speaking = !1, s.suspend = function () {
						o.suspend()
					}, s.resume = function () {
						o.resume()
					}, Object.defineProperty(s, "state", {
						get: function () {
							return o.state
						}
					}), o.onstatechange = function () {
						s.emit("state_change", o.state)
					}, s.setThreshold = function (e) {
						p = e
					}, s.setInterval = function (e) {
						u = e
					}, s.stop = function () {
						m = !1, s.emit("volume_change", -100, p), s.speaking && (s.speaking = !1, s.emit("stopped_speaking")), l.disconnect(), a.disconnect()
					}, s.speakingHistory = [];
					for (var g = 0; g < h; g++) s.speakingHistory.push(0);
					var v = function () {
						setTimeout(function () {
							if (m) {
								var e = n(l, c);
								s.emit("volume_change", e, p);
								var t = 0;
								if (e > p && !s.speaking) {
									for (var i = s.speakingHistory.length - 3; i < s.speakingHistory.length; i++) t += s.speakingHistory[i];
									t >= 2 && (s.speaking = !0, s.emit("speaking"))
								} else if (e < p && s.speaking) {
									for (i = 0; i < s.speakingHistory.length; i++) t += s.speakingHistory[i];
									0 == t && (s.speaking = !1, s.emit("stopped_speaking"))
								}
								s.speakingHistory.shift(), s.speakingHistory.push(0 + (e > p)), v()
							}
						}, u)
					};
					return v(), s
				}
			}, {
				wildemitter: 2
			}],
			2: [function (e, t) {
				function n() {}
				t.exports = n, n.mixin = function (e) {
					var t = e.prototype || e;
					t.isWildEmitter = !0, t.on = function (e) {
						this.callbacks = this.callbacks || {};
						var t = 3 === arguments.length,
							n = t ? arguments[1] : undefined,
							i = t ? arguments[2] : arguments[1];
						return i._groupName = n, (this.callbacks[e] = this.callbacks[e] || []).push(i), this
					}, t.once = function (e) {
						function t() {
							n.off(e, t), o.apply(this, arguments)
						}
						var n = this,
							i = 3 === arguments.length,
							r = i ? arguments[1] : undefined,
							o = i ? arguments[2] : arguments[1];
						return this.on(e, r, t), this
					}, t.releaseGroup = function (e) {
						var t, n, i, r;
						for (t in this.callbacks = this.callbacks || {}, this.callbacks)
							for (n = 0, i = (r = this.callbacks[t]).length; n < i; n++) r[n]._groupName === e && (r.splice(n, 1), n--, i--);
						return this
					}, t.off = function (e, t) {
						this.callbacks = this.callbacks || {};
						var n, i = this.callbacks[e];
						return i ? 1 === arguments.length ? (delete this.callbacks[e], this) : (n = i.indexOf(t), i.splice(n, 1), 0 === i.length && delete this.callbacks[e], this) : this
					}, t.emit = function (e) {
						this.callbacks = this.callbacks || {};
						var t, n, i, r = [].slice.call(arguments, 1),
							o = this.callbacks[e],
							s = this.getWildcardCallbacks(e);
						if (o)
							for (t = 0, n = (i = o.slice()).length; t < n && i[t]; ++t) i[t].apply(this, r);
						if (s)
							for (n = s.length, t = 0, n = (i = s.slice()).length; t < n && i[t]; ++t) i[t].apply(this, [e].concat(r));
						return this
					}, t.getWildcardCallbacks = function (e) {
						this.callbacks = this.callbacks || {};
						var t, n, i = [];
						for (t in this.callbacks) n = t.split("*"), ("*" === t || 2 === n.length && e.slice(0, n[0].length) === n[0]) && (i = i.concat(this.callbacks[t]));
						return i
					}
				}, n.mixin(n)
			}, {}]
		}, {}, [1])(1)
	}),
	/*
		The MIT License (MIT)

		Copyright (c) 2016 Meetecho

		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the "Software"),
		to deal in the Software without restriction, including without limitation
		the rights to use, copy, modify, merge, publish, distribute, sublicense,
		and/or sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included
		in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
		THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
		OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
		ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		OTHER DEALINGS IN THE SOFTWARE.
	 */
	Janus.sessions = {}, Janus.isExtensionEnabled = function () {
		if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) return !0;
		if (window.navigator.userAgent.match("Chrome")) {
			var e = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10),
				t = 33;
			return window.navigator.userAgent.match("Linux") && (t = 35), e >= 26 && e <= t || Janus.extension.isInstalled()
		}
		return !0
	};
var defaultExtension = {
	extensionId: "hapfgfdkleiggjjpfpenajgdnfckjpaj",
	isInstalled: function () {
		return null !== document.querySelector("#janus-extension-installed")
	},
	getScreen: function (e) {
		var t = window.setTimeout(function () {
			var t = new Error("NavigatorUserMediaError");
			return t.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)', e(t)
		}, 1e3);
		this.cache[t] = e, window.postMessage({
			type: "janusGetScreen",
			id: t
		}, "*")
	},
	init: function () {
		var e = {};
		this.cache = e, window.addEventListener("message", function (t) {
			if (t.origin == window.location.origin)
				if ("janusGotScreen" == t.data.type && e[t.data.id]) {
					var n = e[t.data.id];
					if (delete e[t.data.id], "" === t.data.sourceId) {
						var i = new Error("NavigatorUserMediaError");
						i.name = "You cancelled the request for permission, giving up...", n(i)
					} else n(null, t.data.sourceId)
				} else "janusGetScreenPending" == t.data.type && (console.log("clearing ", t.data.id), window.clearTimeout(t.data.id))
		})
	}
};
Janus.useDefaultDependencies = function (e) {
		var t = e && e.fetch || fetch,
			n = e && e.Promise || Promise,
			i = e && e.WebSocket || WebSocket;
		return {
			newWebSocket: function (e, t) {
				return new i(e, t)
			},
			extension: e && e.extension || defaultExtension,
			isArray: function (e) {
				return Array.isArray(e)
			},
			webRTCAdapter: e && e.adapter || adapter,
			httpAPICall: function (e, i) {
				var r = {
					method: i.verb,
					headers: {
						Accept: "application/json, text/plain, */*"
					},
					cache: "no-cache"
				};
				"POST" === i.verb && (r.headers["Content-Type"] = "application/json"), i.withCredentials !== undefined && (r.credentials = !0 === i.withCredentials ? "include" : i.withCredentials ? i.withCredentials : "omit"), i.body && (r.body = JSON.stringify(i.body));
				var o = t(e, r)["catch"](function (e) {
					return n.reject({
						message: "Probably a network error, is the server down?",
						error: e
					})
				});
				if (i.timeout) {
					var s = new n(function (e, t) {
						var n = setTimeout(function () {
							return clearTimeout(n), t({
								message: "Request timed out",
								timeout: i.timeout
							})
						}, i.timeout)
					});
					o = n.race([o, s])
				}
				return o.then(function (e) {
					return e.ok ? typeof i.success == typeof Janus.noop ? e.json().then(function (e) {
						i.success(e)
					})["catch"](function (t) {
						return n.reject({
							message: "Failed to parse response body",
							error: t,
							response: e
						})
					}) : void 0 : n.reject({
						message: "API call failed",
						response: e
					})
				})["catch"](function (e) {
					typeof i.error == typeof Janus.noop && i.error(e.message || "<< internal error >>", e)
				}), o
			}
		}
	}, Janus.useOldDependencies = function (e) {
		var t = e && e.jQuery || jQuery,
			n = e && e.WebSocket || WebSocket;
		return {
			newWebSocket: function (e, t) {
				return new n(e, t)
			},
			isArray: function (e) {
				return t.isArray(e)
			},
			extension: e && e.extension || defaultExtension,
			webRTCAdapter: e && e.adapter || adapter,
			httpAPICall: function (e, n) {
				var i = n.body !== undefined ? {
						contentType: "application/json",
						data: JSON.stringify(n.body)
					} : {},
					r = n.withCredentials !== undefined ? {
						xhrFields: {
							withCredentials: n.withCredentials
						}
					} : {};
				return t.ajax(t.extend(i, r, {
					url: e,
					type: n.verb,
					cache: !1,
					dataType: "json",
					async: n.async,
					timeout: n.timeout,
					success: function (e) {
						typeof n.success == typeof Janus.noop && n.success(e)
					},
					error: function (e, t, i) {
						typeof n.error == typeof Janus.noop && n.error(t, i)
					}
				}))
			}
		}
	}, Janus.noop = function () {}, Janus.dataChanDefaultLabel = "JanusDataChannel", Janus.endOfCandidates = null, Janus.init = function (e) {
		if ((e = e || {}).callback = "function" == typeof e.callback ? e.callback : Janus.noop, Janus.initDone) e.callback();
		else {
			if ("undefined" != typeof console && "undefined" != typeof console.log || (console = {
					log: function () {}
				}), Janus.trace = Janus.noop, Janus.debug = Janus.noop, Janus.vdebug = Janus.noop, Janus.log = Janus.noop, Janus.warn = Janus.noop, Janus.error = Janus.noop, !0 === e.debug || "all" === e.debug) Janus.trace = console.trace.bind(console), Janus.debug = console.debug.bind(console), Janus.vdebug = console.debug.bind(console), Janus.log = console.log.bind(console), Janus.warn = console.warn.bind(console), Janus.error = console.error.bind(console);
			else if (Array.isArray(e.debug))
				for (var t of e.debug) switch (t) {
					case "trace":
						Janus.trace = console.trace.bind(console);
						break;
					case "debug":
						Janus.debug = console.debug.bind(console);
						break;
					case "vdebug":
						Janus.vdebug = console.debug.bind(console);
						break;
					case "log":
						Janus.log = console.log.bind(console);
						break;
					case "warn":
						Janus.warn = console.warn.bind(console);
						break;
					case "error":
						Janus.error = console.error.bind(console);
						break;
					default:
						console.error("Unknown debugging option '" + t + "' (supported: 'trace', 'debug', 'vdebug', 'log', warn', 'error')")
				}
			Janus.log("Initializing library");
			var n = e.dependencies || Janus.useDefaultDependencies();
			Janus.isArray = n.isArray, Janus.webRTCAdapter = n.webRTCAdapter, Janus.httpAPICall = n.httpAPICall, Janus.newWebSocket = n.newWebSocket, Janus.extension = n.extension, Janus.extension.init(), Janus.listDevices = function (e, t) {
				e = "function" == typeof e ? e : Janus.noop, null == t && (t = {
					audio: !0,
					video: !0
				}), Janus.isGetUserMediaAvailable() ? navigator.mediaDevices.getUserMedia(t).then(function (t) {
					navigator.mediaDevices.enumerateDevices().then(function (n) {
						Janus.debug(n), e(n);
						try {
							var i = t.getTracks();
							for (var r of i) r && r.stop()
						} catch (o) {}
					})
				})["catch"](function (t) {
					Janus.error(t), e([])
				}) : (Janus.warn("navigator.mediaDevices unavailable"), e([]))
			}, Janus.attachMediaStream = function (e, t) {
				try {
					e.srcObject = t
				} catch (n) {
					try {
						e.src = URL.createObjectURL(t)
					} catch (n) {
						Janus.error("Error attaching stream to element")
					}
				}
			}, Janus.reattachMediaStream = function (e, t) {
				try {
					e.srcObject = t.srcObject
				} catch (n) {
					try {
						e.src = t.src
					} catch (n) {
						Janus.error("Error reattaching stream to element")
					}
				}
			};
			var i = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0 ? "pagehide" : "beforeunload",
				r = window["on" + i];
			if (window.addEventListener(i, function () {
					for (var e in Janus.log("Closing window"), Janus.sessions) Janus.sessions[e] && Janus.sessions[e].destroyOnUnload && (Janus.log("Destroying session " + e), Janus.sessions[e].destroy({
						unload: !0,
						notifyDestroyed: !1
					}));
					r && "function" == typeof r && r()
				}), Janus.safariVp8 = !1, "safari" === Janus.webRTCAdapter.browserDetails.browser && Janus.webRTCAdapter.browserDetails.version >= 605)
				if (RTCRtpSender && RTCRtpSender.getCapabilities && RTCRtpSender.getCapabilities("video") && RTCRtpSender.getCapabilities("video").codecs && RTCRtpSender.getCapabilities("video").codecs.length) {
					for (var o of RTCRtpSender.getCapabilities("video").codecs)
						if (o && o.mimeType && "video/vp8" === o.mimeType.toLowerCase()) {
							Janus.safariVp8 = !0;
							break
						} Janus.safariVp8 ? Janus.log("This version of Safari supports VP8") : Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu")
				} else {
					var s = new RTCPeerConnection({});
					s.createOffer({
						offerToReceiveVideo: !0
					}).then(function (e) {
						Janus.safariVp8 = -1 !== e.sdp.indexOf("VP8"), Janus.safariVp8 ? Janus.log("This version of Safari supports VP8") : Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu"), s.close(), s = null
					})
				} if (Janus.unifiedPlan = !1, "firefox" === Janus.webRTCAdapter.browserDetails.browser && Janus.webRTCAdapter.browserDetails.version >= 59) Janus.unifiedPlan = !0;
			else if ("chrome" === Janus.webRTCAdapter.browserDetails.browser && Janus.webRTCAdapter.browserDetails.version < 72) Janus.unifiedPlan = !1;
			else if (window.RTCRtpTransceiver && "currentDirection" in RTCRtpTransceiver.prototype) {
				var a = new RTCPeerConnection;
				try {
					a.addTransceiver("audio"), Janus.unifiedPlan = !0
				} catch (c) {}
				a.close()
			} else Janus.unifiedPlan = !1;
			Janus.initDone = !0, e.callback()
		}
	}, Janus.isWebrtcSupported = function () {
		return !!window.RTCPeerConnection
	}, Janus.isGetUserMediaAvailable = function () {
		return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
	}, Janus.randomString = function (e) {
		for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = "", i = 0; i < e; i++) {
			var r = Math.floor(Math.random() * t.length);
			n += t.substring(r, r + 1)
		}
		return n
	},
	/*! NoSleep.js v0.11.0 - git.io/vfn01 - Rich Tibbett - MIT license */
	function (e, t) {
		"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.NoSleep = t() : e.NoSleep = t()
	}(window, function () {
		return function (e) {
			function t(i) {
				if (n[i]) return n[i].exports;
				var r = n[i] = {
					i: i,
					l: !1,
					exports: {}
				};
				return e[i].call(r.exports, r, r.exports, t), r.l = !0, r.exports
			}
			var n = {};
			return t.m = e, t.c = n, t.d = function (e, n, i) {
				t.o(e, n) || Object.defineProperty(e, n, {
					enumerable: !0,
					get: i
				})
			}, t.r = function (e) {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
					value: "Module"
				}), Object.defineProperty(e, "__esModule", {
					value: !0
				})
			}, t.t = function (e, n) {
				if (1 & n && (e = t(e)), 8 & n) return e;
				if (4 & n && "object" == typeof e && e && e.__esModule) return e;
				var i = Object.create(null);
				if (t.r(i), Object.defineProperty(i, "default", {
						enumerable: !0,
						value: e
					}), 2 & n && "string" != typeof e)
					for (var r in e) t.d(i, r, function (t) {
						return e[t]
					}.bind(null, r));
				return i
			}, t.n = function (e) {
				var n = e && e.__esModule ? function () {
					return e["default"]
				} : function () {
					return e
				};
				return t.d(n, "a", n), n
			}, t.o = function (e, t) {
				return Object.prototype.hasOwnProperty.call(e, t)
			}, t.p = "", t(t.s = 0)
		}([function (e, t, n) {
			"use strict";

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}
			var r = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var i = t[n];
							i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
						}
					}
					return function (t, n, i) {
						return n && e(t.prototype, n), i && e(t, i), t
					}
				}(),
				o = n(1),
				s = o.webm,
				a = o.mp4,
				c = "undefined" != typeof navigator && parseFloat(("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) < 10 && !window.MSStream,
				l = "wakeLock" in navigator,
				d = function () {
					function e() {
						var t = this;
						if (i(this, e), l) {
							this._wakeLock = null;
							var n = function () {
								null !== t._wakeLock && "visible" === document.visibilityState && t.enable()
							};
							document.addEventListener("visibilitychange", n), document.addEventListener("fullscreenchange", n)
						} else c ? this.noSleepTimer = null : (this.noSleepVideo = document.createElement("video"), this.noSleepVideo.setAttribute("title", "LiveVoice"), this.noSleepVideo.setAttribute("playsinline", ""), this._addSourceToVideo(this.noSleepVideo, "webm", s), this._addSourceToVideo(this.noSleepVideo, "mp4", a), this.noSleepVideo.addEventListener("loadedmetadata", function () {
							t.noSleepVideo.duration <= 1 ? t.noSleepVideo.setAttribute("loop", "") : t.noSleepVideo.addEventListener("timeupdate", function () {
								t.noSleepVideo.currentTime > .5 && (t.noSleepVideo.currentTime = Math.random())
							})
						}))
					}
					return r(e, [{
						key: "_addSourceToVideo",
						value: function (e, t, n) {
							var i = document.createElement("source");
							i.src = n, i.type = "video/" + t, e.appendChild(i)
						}
					}, {
						key: "enable",
						value: function () {
							var e = this;
							l ? navigator.wakeLock.request("screen").then(function (t) {
								e._wakeLock = t, console.log("Wake Lock active."), e._wakeLock.addEventListener("release", function () {
									console.log("Wake Lock released.")
								})
							})["catch"](function (e) {
								console.error(e.name + ", " + e.message)
							}) : c ? (this.disable(), console.warn("\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      "), this.noSleepTimer = window.setInterval(function () {
								document.hidden || (window.location.href = window.location.href.split("#")[0], window.setTimeout(window.stop, 0))
							}, 15e3)) : this.noSleepVideo.play()
						}
					}, {
						key: "disable",
						value: function () {
							l ? (this._wakeLock.release(), this._wakeLock = null) : c ? this.noSleepTimer && (console.warn("\n          NoSleep now disabled for older iOS devices.\n        "), window.clearInterval(this.noSleepTimer), this.noSleepTimer = null) : this.noSleepVideo.pause()
						}
					}]), e
				}();
			e.exports = d
		}, function (e) {
			"use strict";
			e.exports = {
				webm: "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
				mp4: "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA="
			}
		}])
	}),
	function (e) {
		"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = function (t, n) {
			return void 0 === n && (n = "undefined" != typeof window ? require("jquery") : require("jquery")(t)), e(n), n
		} : e(jQuery)
	}(function (e) {
		var t = function () {
				function t(e, t) {
					return w.call(e, t)
				}

				function n(e, t) {
					var n, i, r, o, s, a, c, l, d, u, p, f = t && t.split("/"),
						h = A.map,
						m = h && h["*"] || {};
					if (e) {
						for (s = (e = e.split("/")).length - 1, A.nodeIdCompat && C.test(e[s]) && (e[s] = e[s].replace(C, "")), "." === e[0].charAt(0) && f && (e = f.slice(0, f.length - 1).concat(e)), d = 0; d < e.length; d++)
							if ("." === (p = e[d])) e.splice(d, 1), --d;
							else if (".." === p) {
							if (0 === d || 1 === d && ".." === e[2] || ".." === e[d - 1]) continue;
							0 < d && (e.splice(d - 1, 2), d -= 2)
						}
						e = e.join("/")
					}
					if ((f || m) && h) {
						for (d = (n = e.split("/")).length; 0 < d; --d) {
							if (i = n.slice(0, d).join("/"), f)
								for (u = f.length; 0 < u; --u)
									if (r = (r = h[f.slice(0, u).join("/")]) && r[i]) {
										o = r, a = d;
										break
									} if (o) break;
							!c && m && m[i] && (c = m[i], l = d)
						}!o && c && (o = c, a = l), o && (n.splice(0, a, o), e = n.join("/"))
					}
					return e
				}

				function i(e, t) {
					return function () {
						var n = S.call(arguments, 0);
						return "string" != typeof n[0] && 1 === n.length && n.push(null), h.apply(p, n.concat([e, t]))
					}
				}

				function r(e) {
					return function (t) {
						v[e] = t
					}
				}

				function o(e) {
					if (t(y, e)) {
						var n = y[e];
						delete y[e], b[e] = !0, f.apply(p, n)
					}
					if (!t(v, e) && !t(b, e)) throw new Error("No " + e);
					return v[e]
				}

				function s(e) {
					var t, n = e ? e.indexOf("!") : -1;
					return -1 < n && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e]
				}

				function a(e) {
					return e ? s(e) : []
				}
				if (e && e.fn && e.fn.select2 && e.fn.select2.amd) var c = e.fn.select2.amd;
				var l, d, u, p, f, h, m, g, v, y, A, b, w, S, C;
				return c && c.requirejs || (c ? d = c : c = {}, v = {}, y = {}, A = {}, b = {}, w = Object.prototype.hasOwnProperty, S = [].slice, C = /\.js$/, m = function (e, t) {
					var i, r, a = s(e),
						c = a[0],
						l = t[1];
					return e = a[1], c && (i = o(c = n(c, l))), c ? e = i && i.normalize ? i.normalize(e, (r = l, function (e) {
						return n(e, r)
					})) : n(e, l) : (c = (a = s(e = n(e, l)))[0], e = a[1], c && (i = o(c))), {
						f: c ? c + "!" + e : e,
						n: e,
						pr: c,
						p: i
					}
				}, g = {
					require: function (e) {
						return i(e)
					},
					exports: function (e) {
						var t = v[e];
						return void 0 !== t ? t : v[e] = {}
					},
					module: function (e) {
						return {
							id: e,
							uri: "",
							exports: v[e],
							config: (t = e, function () {
								return A && A.config && A.config[t] || {}
							})
						};
						var t
					}
				}, f = function (e, n, s, c) {
					var l, d, u, f, h, A, w, S = [],
						C = typeof s;
					if (A = a(c = c || e), "undefined" == C || "function" == C) {
						for (n = !n.length && s.length ? ["require", "exports", "module"] : n, h = 0; h < n.length; h += 1)
							if ("require" === (d = (f = m(n[h], A)).f)) S[h] = g.require(e);
							else if ("exports" === d) S[h] = g.exports(e), w = !0;
						else if ("module" === d) l = S[h] = g.module(e);
						else if (t(v, d) || t(y, d) || t(b, d)) S[h] = o(d);
						else {
							if (!f.p) throw new Error(e + " missing " + d);
							f.p.load(f.n, i(c, !0), r(d), {}), S[h] = v[d]
						}
						u = s ? s.apply(v[e], S) : void 0, e && (l && l.exports !== p && l.exports !== v[e] ? v[e] = l.exports : u === p && w || (v[e] = u))
					} else e && (v[e] = s)
				}, l = d = h = function (e, t, n, i, r) {
					if ("string" == typeof e) return g[e] ? g[e](t) : o(m(e, a(t)).f);
					if (!e.splice) {
						if ((A = e).deps && h(A.deps, A.callback), !t) return;
						t.splice ? (e = t, t = n, n = null) : e = p
					}
					return t = t || function () {}, "function" == typeof n && (n = i, i = r), i ? f(p, e, t, n) : setTimeout(function () {
						f(p, e, t, n)
					}, 4), h
				}, h.config = function (e) {
					return h(e)
				}, l._defined = v, (u = function (e, n, i) {
					if ("string" != typeof e) throw new Error("See almond README: incorrect module build, no module name");
					n.splice || (i = n, n = []), t(v, e) || t(y, e) || (y[e] = [e, n, i])
				}).amd = {
					jQuery: !0
				}, c.requirejs = l, c.require = d, c.define = u), c.define("almond", function () {}), c.define("jquery", [], function () {
					var t = e || $;
					return null == t && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), t
				}), c.define("select2/utils", ["jquery"], function (e) {
					function t(e) {
						var t = e.prototype,
							n = [];
						for (var i in t) "function" == typeof t[i] && "constructor" !== i && n.push(i);
						return n
					}

					function n() {
						this.listeners = {}
					}
					var i = {
						Extend: function (e, t) {
							function n() {
								this.constructor = e
							}
							var i = {}.hasOwnProperty;
							for (var r in t) i.call(t, r) && (e[r] = t[r]);
							return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
						},
						Decorate: function (e, n) {
							function i() {
								var t = Array.prototype.unshift,
									i = n.prototype.constructor.length,
									r = e.prototype.constructor;
								0 < i && (t.call(arguments, e.prototype.constructor), r = n.prototype.constructor), r.apply(this, arguments)
							}

							function r(e) {
								var t = function () {};
								e in i.prototype && (t = i.prototype[e]);
								var r = n.prototype[e];
								return function () {
									return Array.prototype.unshift.call(arguments, t), r.apply(this, arguments)
								}
							}
							var o = t(n),
								s = t(e);
							n.displayName = e.displayName, i.prototype = new function () {
								this.constructor = i
							};
							for (var a = 0; a < s.length; a++) {
								var c = s[a];
								i.prototype[c] = e.prototype[c]
							}
							for (var l = 0; l < o.length; l++) {
								var d = o[l];
								i.prototype[d] = r(d)
							}
							return i
						}
					};
					n.prototype.on = function (e, t) {
						this.listeners = this.listeners || {}, e in this.listeners ? this.listeners[e].push(t) : this.listeners[e] = [t]
					}, n.prototype.trigger = function (e) {
						var t = Array.prototype.slice,
							n = t.call(arguments, 1);
						this.listeners = this.listeners || {}, null == n && (n = []), 0 === n.length && n.push({}), (n[0]._type = e) in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)), "*" in this.listeners && this.invoke(this.listeners["*"], arguments)
					}, n.prototype.invoke = function (e, t) {
						for (var n = 0, i = e.length; n < i; n++) e[n].apply(this, t)
					}, i.Observable = n, i.generateChars = function (e) {
						for (var t = "", n = 0; n < e; n++) t += Math.floor(36 * Math.random()).toString(36);
						return t
					}, i.bind = function (e, t) {
						return function () {
							e.apply(t, arguments)
						}
					}, i._convertData = function (e) {
						for (var t in e) {
							var n = t.split("-"),
								i = e;
							if (1 !== n.length) {
								for (var r = 0; r < n.length; r++) {
									var o = n[r];
									(o = o.substring(0, 1).toLowerCase() + o.substring(1)) in i || (i[o] = {}), r == n.length - 1 && (i[o] = e[t]), i = i[o]
								}
								delete e[t]
							}
						}
						return e
					}, i.hasScroll = function (t, n) {
						var i = e(n),
							r = n.style.overflowX,
							o = n.style.overflowY;
						return (r !== o || "hidden" !== o && "visible" !== o) && ("scroll" === r || "scroll" === o || i.innerHeight() < n.scrollHeight || i.innerWidth() < n.scrollWidth)
					}, i.escapeMarkup = function (e) {
						var t = {
							"\\": "&#92;",
							"&": "&amp;",
							"<": "&lt;",
							">": "&gt;",
							'"': "&quot;",
							"'": "&#39;",
							"/": "&#47;"
						};
						return "string" != typeof e ? e : String(e).replace(/[&<>"'\/\\]/g, function (e) {
							return t[e]
						})
					}, i.appendMany = function (t, n) {
						if ("1.7" === e.fn.jquery.substr(0, 3)) {
							var i = e();
							e.map(n, function (e) {
								i = i.add(e)
							}), n = i
						}
						t.append(n)
					}, i.__cache = {};
					var r = 0;
					return i.GetUniqueElementId = function (e) {
						var t = e.getAttribute("data-select2-id");
						return null == t && (e.id ? (t = e.id, e.setAttribute("data-select2-id", t)) : (e.setAttribute("data-select2-id", ++r), t = r.toString())), t
					}, i.StoreData = function (e, t, n) {
						var r = i.GetUniqueElementId(e);
						i.__cache[r] || (i.__cache[r] = {}), i.__cache[r][t] = n
					}, i.GetData = function (t, n) {
						var r = i.GetUniqueElementId(t);
						return n ? i.__cache[r] && null != i.__cache[r][n] ? i.__cache[r][n] : e(t).data(n) : i.__cache[r]
					}, i.RemoveData = function (e) {
						var t = i.GetUniqueElementId(e);
						null != i.__cache[t] && delete i.__cache[t], e.removeAttribute("data-select2-id")
					}, i
				}), c.define("select2/results", ["jquery", "./utils"], function (e, t) {
					function n(e, t, i) {
						this.$element = e, this.data = i, this.options = t, n.__super__.constructor.call(this)
					}
					return t.Extend(n, t.Observable), n.prototype.render = function () {
						var t = e('<ul class="select2-results__options" role="listbox"></ul>');
						return this.options.get("multiple") && t.attr("aria-multiselectable", "true"), this.$results = t
					}, n.prototype.clear = function () {
						this.$results.empty()
					}, n.prototype.displayMessage = function (t) {
						var n = this.options.get("escapeMarkup");
						this.clear(), this.hideLoading();
						var i = e('<li role="alert" aria-live="assertive" class="select2-results__option"></li>'),
							r = this.options.get("translations").get(t.message);
						i.append(n(r(t.args))), i[0].className += " select2-results__message", this.$results.append(i)
					}, n.prototype.hideMessages = function () {
						this.$results.find(".select2-results__message").remove()
					}, n.prototype.append = function (e) {
						this.hideLoading();
						var t = [];
						if (null != e.results && 0 !== e.results.length) {
							e.results = this.sort(e.results);
							for (var n = 0; n < e.results.length; n++) {
								var i = e.results[n],
									r = this.option(i);
								t.push(r)
							}
							this.$results.append(t)
						} else 0 === this.$results.children().length && this.trigger("results:message", {
							message: "noResults"
						})
					}, n.prototype.position = function (e, t) {
						t.find(".select2-results").append(e)
					}, n.prototype.sort = function (e) {
						return this.options.get("sorter")(e)
					}, n.prototype.highlightFirstItem = function () {
						var e = this.$results.find(".select2-results__option[aria-selected]"),
							t = e.filter("[aria-selected=true]");
						0 < t.length ? t.first().trigger("mouseenter") : e.first().trigger("mouseenter"), this.ensureHighlightVisible()
					}, n.prototype.setClasses = function () {
						var n = this;
						this.data.current(function (i) {
							var r = e.map(i, function (e) {
								return e.id.toString()
							});
							n.$results.find(".select2-results__option[aria-selected]").each(function () {
								var n = e(this),
									i = t.GetData(this, "data"),
									o = "" + i.id;
								null != i.element && i.element.selected || null == i.element && -1 < e.inArray(o, r) ? n.attr("aria-selected", "true") : n.attr("aria-selected", "false")
							})
						})
					}, n.prototype.showLoading = function (e) {
						this.hideLoading();
						var t = {
								disabled: !0,
								loading: !0,
								text: this.options.get("translations").get("searching")(e)
							},
							n = this.option(t);
						n.className += " loading-results", this.$results.prepend(n)
					}, n.prototype.hideLoading = function () {
						this.$results.find(".loading-results").remove()
					}, n.prototype.option = function (n) {
						var i = document.createElement("li");
						i.className = "select2-results__option";
						var r = {
								role: "option",
								"aria-selected": "false"
							},
							o = window.Element.prototype.matches || window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
						for (var s in (null != n.element && o.call(n.element, ":disabled") || null == n.element && n.disabled) && (delete r["aria-selected"], r["aria-disabled"] = "true"), null == n.id && delete r["aria-selected"], null != n._resultId && (i.id = n._resultId), n.title && (i.title = n.title), n.children && (r.role = "group", r["aria-label"] = n.text, delete r["aria-selected"]), r) {
							var a = r[s];
							i.setAttribute(s, a)
						}
						if (n.children) {
							var c = e(i),
								l = document.createElement("strong");
							l.className = "select2-results__group", e(l), this.template(n, l);
							for (var d = [], u = 0; u < n.children.length; u++) {
								var p = n.children[u],
									f = this.option(p);
								d.push(f)
							}
							var h = e("<ul></ul>", {
								"class": "select2-results__options select2-results__options--nested"
							});
							h.append(d), c.append(l), c.append(h)
						} else this.template(n, i);
						return t.StoreData(i, "data", n), i
					}, n.prototype.bind = function (n) {
						var i = this,
							r = n.id + "-results";
						this.$results.attr("id", r), n.on("results:all", function (e) {
							i.clear(), i.append(e.data), n.isOpen() && (i.setClasses(), i.highlightFirstItem())
						}), n.on("results:append", function (e) {
							i.append(e.data), n.isOpen() && i.setClasses()
						}), n.on("query", function (e) {
							i.hideMessages(), i.showLoading(e)
						}), n.on("select", function () {
							n.isOpen() && (i.setClasses(), i.options.get("scrollAfterSelect") && i.highlightFirstItem())
						}), n.on("unselect", function () {
							n.isOpen() && (i.setClasses(), i.options.get("scrollAfterSelect") && i.highlightFirstItem())
						}), n.on("open", function () {
							i.$results.attr("aria-expanded", "true"), i.$results.attr("aria-hidden", "false"), i.setClasses(), i.ensureHighlightVisible()
						}), n.on("close", function () {
							i.$results.attr("aria-expanded", "false"), i.$results.attr("aria-hidden", "true"), i.$results.removeAttr("aria-activedescendant")
						}), n.on("results:toggle", function () {
							var e = i.getHighlightedResults();
							0 !== e.length && e.trigger("mouseup")
						}), n.on("results:select", function () {
							var e = i.getHighlightedResults();
							if (0 !== e.length) {
								var n = t.GetData(e[0], "data");
								"true" == e.attr("aria-selected") ? i.trigger("close", {}) : i.trigger("select", {
									data: n
								})
							}
						}), n.on("results:previous", function () {
							var e = i.getHighlightedResults(),
								t = i.$results.find("[aria-selected]"),
								n = t.index(e);
							if (!(n <= 0)) {
								var r = n - 1;
								0 === e.length && (r = 0);
								var o = t.eq(r);
								o.trigger("mouseenter");
								var s = i.$results.offset().top,
									a = o.offset().top,
									c = i.$results.scrollTop() + (a - s);
								0 === r ? i.$results.scrollTop(0) : a - s < 0 && i.$results.scrollTop(c)
							}
						}), n.on("results:next", function () {
							var e = i.getHighlightedResults(),
								t = i.$results.find("[aria-selected]"),
								n = t.index(e) + 1;
							if (!(n >= t.length)) {
								var r = t.eq(n);
								r.trigger("mouseenter");
								var o = i.$results.offset().top + i.$results.outerHeight(!1),
									s = r.offset().top + r.outerHeight(!1),
									a = i.$results.scrollTop() + s - o;
								0 === n ? i.$results.scrollTop(0) : o < s && i.$results.scrollTop(a)
							}
						}), n.on("results:focus", function (e) {
							e.element.addClass("select2-results__option--highlighted")
						}), n.on("results:message", function (e) {
							i.displayMessage(e)
						}), e.fn.mousewheel && this.$results.on("mousewheel", function (e) {
							var t = i.$results.scrollTop(),
								n = i.$results.get(0).scrollHeight - t + e.deltaY,
								r = 0 < e.deltaY && t - e.deltaY <= 0,
								o = e.deltaY < 0 && n <= i.$results.height();
							r ? (i.$results.scrollTop(0), e.preventDefault(), e.stopPropagation()) : o && (i.$results.scrollTop(i.$results.get(0).scrollHeight - i.$results.height()), e.preventDefault(), e.stopPropagation())
						}), this.$results.on("mouseup", ".select2-results__option[aria-selected]", function (n) {
							var r = e(this),
								o = t.GetData(this, "data");
							"true" !== r.attr("aria-selected") ? i.trigger("select", {
								originalEvent: n,
								data: o
							}) : i.options.get("multiple") ? i.trigger("unselect", {
								originalEvent: n,
								data: o
							}) : i.trigger("close", {})
						}), this.$results.on("mouseenter", ".select2-results__option[aria-selected]", function () {
							var n = t.GetData(this, "data");
							i.getHighlightedResults().removeClass("select2-results__option--highlighted"), i.trigger("results:focus", {
								data: n,
								element: e(this)
							})
						})
					}, n.prototype.getHighlightedResults = function () {
						return this.$results.find(".select2-results__option--highlighted")
					}, n.prototype.destroy = function () {
						this.$results.remove()
					}, n.prototype.ensureHighlightVisible = function () {
						var e = this.getHighlightedResults();
						if (0 !== e.length) {
							var t = this.$results.find("[aria-selected]").index(e),
								n = this.$results.offset().top,
								i = e.offset().top,
								r = this.$results.scrollTop() + (i - n),
								o = i - n;
							r -= 2 * e.outerHeight(!1), t <= 2 ? this.$results.scrollTop(0) : (o > this.$results.outerHeight() || o < 0) && this.$results.scrollTop(r)
						}
					}, n.prototype.template = function (t, n) {
						var i = this.options.get("templateResult"),
							r = this.options.get("escapeMarkup"),
							o = i(t, n);
						null == o ? n.style.display = "none" : "string" == typeof o ? n.innerHTML = r(o) : e(n).append(o)
					}, n
				}), c.define("select2/keys", [], function () {
					return {
						BACKSPACE: 8,
						TAB: 9,
						ENTER: 13,
						SHIFT: 16,
						CTRL: 17,
						ALT: 18,
						ESC: 27,
						SPACE: 32,
						PAGE_UP: 33,
						PAGE_DOWN: 34,
						END: 35,
						HOME: 36,
						LEFT: 37,
						UP: 38,
						RIGHT: 39,
						DOWN: 40,
						DELETE: 46
					}
				}), c.define("select2/selection/base", ["jquery", "../utils", "../keys"], function (e, t, n) {
					function i(e, t) {
						this.$element = e, this.options = t, i.__super__.constructor.call(this)
					}
					return t.Extend(i, t.Observable), i.prototype.render = function () {
						var n = e('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');
						return this._tabindex = 0, null != t.GetData(this.$element[0], "old-tabindex") ? this._tabindex = t.GetData(this.$element[0], "old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")), n.attr("title", this.$element.attr("title")), n.attr("tabindex", this._tabindex), n.attr("aria-disabled", "false"), this.$selection = n
					}, i.prototype.bind = function (e) {
						var t = this,
							i = e.id + "-results";
						this.container = e, this.$selection.on("focus", function (e) {
							t.trigger("focus", e)
						}), this.$selection.on("blur", function (e) {
							t._handleBlur(e)
						}), this.$selection.on("keydown", function (e) {
							t.trigger("keypress", e), e.which === n.SPACE && e.preventDefault()
						}), e.on("results:focus", function (e) {
							t.$selection.attr("aria-activedescendant", e.data._resultId)
						}), e.on("selection:update", function (e) {
							t.update(e.data)
						}), e.on("open", function () {
							t.$selection.attr("aria-expanded", "true"), t.$selection.attr("aria-owns", i), t._attachCloseHandler(e)
						}), e.on("close", function () {
							t.$selection.attr("aria-expanded", "false"), t.$selection.removeAttr("aria-activedescendant"), t.$selection.removeAttr("aria-owns"), t.$selection.trigger("focus"), t._detachCloseHandler(e)
						}), e.on("enable", function () {
							t.$selection.attr("tabindex", t._tabindex), t.$selection.attr("aria-disabled", "false")
						}), e.on("disable", function () {
							t.$selection.attr("tabindex", "-1"), t.$selection.attr("aria-disabled", "true")
						})
					}, i.prototype._handleBlur = function (t) {
						var n = this;
						window.setTimeout(function () {
							document.activeElement == n.$selection[0] || e.contains(n.$selection[0], document.activeElement) || n.trigger("blur", t)
						}, 1)
					}, i.prototype._attachCloseHandler = function (n) {
						e(document.body).on("mousedown.select2." + n.id, function (n) {
							var i = e(n.target).closest(".select2");
							e(".select2.select2-container--open").each(function () {
								this != i[0] && t.GetData(this, "element").select2("close")
							})
						})
					}, i.prototype._detachCloseHandler = function (t) {
						e(document.body).off("mousedown.select2." + t.id)
					}, i.prototype.position = function (e, t) {
						t.find(".selection").append(e)
					}, i.prototype.destroy = function () {
						this._detachCloseHandler(this.container)
					}, i.prototype.update = function () {
						throw new Error("The `update` method must be defined in child classes.")
					}, i.prototype.isEnabled = function () {
						return !this.isDisabled()
					}, i.prototype.isDisabled = function () {
						return this.options.get("disabled")
					}, i
				}), c.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function (e, t, n) {
					function i() {
						i.__super__.constructor.apply(this, arguments)
					}
					return n.Extend(i, t), i.prototype.render = function () {
						var e = i.__super__.render.call(this);
						return e.addClass("select2-selection--single"), e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), e
					}, i.prototype.bind = function (e) {
						var t = this;
						i.__super__.bind.apply(this, arguments);
						var n = e.id + "-container";
						this.$selection.find(".select2-selection__rendered").attr("id", n).attr("role", "textbox").attr("aria-readonly", "true"), this.$selection.attr("aria-labelledby", n), this.$selection.on("mousedown", function (e) {
							1 === e.which && t.trigger("toggle", {
								originalEvent: e
							})
						}), this.$selection.on("focus", function () {}), this.$selection.on("blur", function () {}), e.on("focus", function () {
							e.isOpen() || t.$selection.trigger("focus")
						})
					}, i.prototype.clear = function () {
						var e = this.$selection.find(".select2-selection__rendered");
						e.empty(), e.removeAttr("title")
					}, i.prototype.display = function (e, t) {
						var n = this.options.get("templateSelection");
						return this.options.get("escapeMarkup")(n(e, t))
					}, i.prototype.selectionContainer = function () {
						return e("<span></span>")
					}, i.prototype.update = function (e) {
						if (0 !== e.length) {
							var t = e[0],
								n = this.$selection.find(".select2-selection__rendered"),
								i = this.display(t, n);
							n.empty().append(i);
							var r = t.title || t.text;
							r ? n.attr("title", r) : n.removeAttr("title")
						} else this.clear()
					}, i
				}), c.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function (e, t, n) {
					function i() {
						i.__super__.constructor.apply(this, arguments)
					}
					return n.Extend(i, t), i.prototype.render = function () {
						var e = i.__super__.render.call(this);
						return e.addClass("select2-selection--multiple"), e.html('<ul class="select2-selection__rendered"></ul>'), e
					}, i.prototype.bind = function () {
						var t = this;
						i.__super__.bind.apply(this, arguments), this.$selection.on("click", function (e) {
							t.trigger("toggle", {
								originalEvent: e
							})
						}), this.$selection.on("click", ".select2-selection__choice__remove", function (i) {
							if (!t.isDisabled()) {
								var r = e(this).parent(),
									o = n.GetData(r[0], "data");
								t.trigger("unselect", {
									originalEvent: i,
									data: o
								})
							}
						})
					}, i.prototype.clear = function () {
						var e = this.$selection.find(".select2-selection__rendered");
						e.empty(), e.removeAttr("title")
					}, i.prototype.display = function (e, t) {
						var n = this.options.get("templateSelection");
						return this.options.get("escapeMarkup")(n(e, t))
					}, i.prototype.selectionContainer = function () {
						return e('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')
					}, i.prototype.update = function (e) {
						if (this.clear(), 0 !== e.length) {
							for (var t = [], i = 0; i < e.length; i++) {
								var r = e[i],
									o = this.selectionContainer(),
									s = this.display(r, o);
								o.append(s);
								var a = r.title || r.text;
								a && o.attr("title", a), n.StoreData(o[0], "data", r), t.push(o)
							}
							var c = this.$selection.find(".select2-selection__rendered");
							n.appendMany(c, t)
						}
					}, i
				}), c.define("select2/selection/placeholder", ["../utils"], function () {
					function e(e, t, n) {
						this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n)
					}
					return e.prototype.normalizePlaceholder = function (e, t) {
						return "string" == typeof t && (t = {
							id: "",
							text: t
						}), t
					}, e.prototype.createPlaceholder = function (e, t) {
						var n = this.selectionContainer();
						return n.html(this.display(t)), n.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"), n
					}, e.prototype.update = function (e, t) {
						var n = 1 == t.length && t[0].id != this.placeholder.id;
						if (1 < t.length || n) return e.call(this, t);
						this.clear();
						var i = this.createPlaceholder(this.placeholder);
						this.$selection.find(".select2-selection__rendered").append(i)
					}, e
				}), c.define("select2/selection/allowClear", ["jquery", "../keys", "../utils"], function (e, t, n) {
					function i() {}
					return i.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function (e) {
							i._handleClear(e)
						}), t.on("keypress", function (e) {
							i._handleKeyboardClear(e, t)
						})
					}, i.prototype._handleClear = function (e, t) {
						if (!this.isDisabled()) {
							var i = this.$selection.find(".select2-selection__clear");
							if (0 !== i.length) {
								t.stopPropagation();
								var r = n.GetData(i[0], "data"),
									o = this.$element.val();
								this.$element.val(this.placeholder.id);
								var s = {
									data: r
								};
								if (this.trigger("clear", s), s.prevented) this.$element.val(o);
								else {
									for (var a = 0; a < r.length; a++)
										if (s = {
												data: r[a]
											}, this.trigger("unselect", s), s.prevented) return void this.$element.val(o);
									this.$element.trigger("input").trigger("change"), this.trigger("toggle", {})
								}
							}
						}
					}, i.prototype._handleKeyboardClear = function (e, n, i) {
						i.isOpen() || n.which != t.DELETE && n.which != t.BACKSPACE || this._handleClear(n)
					}, i.prototype.update = function (t, i) {
						if (t.call(this, i), !(0 < this.$selection.find(".select2-selection__placeholder").length || 0 === i.length)) {
							var r = this.options.get("translations").get("removeAllItems"),
								o = e('<span class="select2-selection__clear" title="' + r() + '">&times;</span>');
							n.StoreData(o[0], "data", i), this.$selection.find(".select2-selection__rendered").prepend(o)
						}
					}, i
				}), c.define("select2/selection/search", ["jquery", "../utils", "../keys"], function (e, t, n) {
					function i(e, t, n) {
						e.call(this, t, n)
					}
					return i.prototype.render = function (t) {
						var n = e('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>');
						this.$searchContainer = n, this.$search = n.find("input");
						var i = t.call(this);
						return this._transferTabIndex(), i
					}, i.prototype.bind = function (e, i, r) {
						var o = this,
							s = i.id + "-results";
						e.call(this, i, r), i.on("open", function () {
							o.$search.attr("aria-controls", s), o.$search.trigger("focus")
						}), i.on("close", function () {
							o.$search.val(""), o.$search.removeAttr("aria-controls"), o.$search.removeAttr("aria-activedescendant"), o.$search.trigger("focus")
						}), i.on("enable", function () {
							o.$search.prop("disabled", !1), o._transferTabIndex()
						}), i.on("disable", function () {
							o.$search.prop("disabled", !0)
						}), i.on("focus", function () {
							o.$search.trigger("focus")
						}), i.on("results:focus", function (e) {
							e.data._resultId ? o.$search.attr("aria-activedescendant", e.data._resultId) : o.$search.removeAttr("aria-activedescendant")
						}), this.$selection.on("focusin", ".select2-search--inline", function (e) {
							o.trigger("focus", e)
						}), this.$selection.on("focusout", ".select2-search--inline", function (e) {
							o._handleBlur(e)
						}), this.$selection.on("keydown", ".select2-search--inline", function (e) {
							if (e.stopPropagation(), o.trigger("keypress", e), o._keyUpPrevented = e.isDefaultPrevented(), e.which === n.BACKSPACE && "" === o.$search.val()) {
								var i = o.$searchContainer.prev(".select2-selection__choice");
								if (0 < i.length) {
									var r = t.GetData(i[0], "data");
									o.searchRemoveChoice(r), e.preventDefault()
								}
							}
						}), this.$selection.on("click", ".select2-search--inline", function (e) {
							o.$search.val() && e.stopPropagation()
						});
						var a = document.documentMode,
							c = a && a <= 11;
						this.$selection.on("input.searchcheck", ".select2-search--inline", function () {
							c ? o.$selection.off("input.search input.searchcheck") : o.$selection.off("keyup.search")
						}), this.$selection.on("keyup.search input.search", ".select2-search--inline", function (e) {
							if (c && "input" === e.type) o.$selection.off("input.search input.searchcheck");
							else {
								var t = e.which;
								t != n.SHIFT && t != n.CTRL && t != n.ALT && t != n.TAB && o.handleSearch(e)
							}
						})
					}, i.prototype._transferTabIndex = function () {
						this.$search.attr("tabindex", this.$selection.attr("tabindex")), this.$selection.attr("tabindex", "-1")
					}, i.prototype.createPlaceholder = function (e, t) {
						this.$search.attr("placeholder", t.text)
					}, i.prototype.update = function (e, t) {
						var n = this.$search[0] == document.activeElement;
						this.$search.attr("placeholder", ""), e.call(this, t), this.$selection.find(".select2-selection__rendered").append(this.$searchContainer), this.resizeSearch(), n && this.$search.trigger("focus")
					}, i.prototype.handleSearch = function () {
						if (this.resizeSearch(), !this._keyUpPrevented) {
							var e = this.$search.val();
							this.trigger("query", {
								term: e
							})
						}
						this._keyUpPrevented = !1
					}, i.prototype.searchRemoveChoice = function (e, t) {
						this.trigger("unselect", {
							data: t
						}), this.$search.val(t.text), this.handleSearch()
					}, i.prototype.resizeSearch = function () {
						this.$search.css("width", "25px");
						var e = "";
						e = "" !== this.$search.attr("placeholder") ? this.$selection.find(".select2-selection__rendered").width() : .75 * (this.$search.val().length + 1) + "em", this.$search.css("width", e)
					}, i
				}), c.define("select2/selection/eventRelay", ["jquery"], function (e) {
					function t() {}
					return t.prototype.bind = function (t, n, i) {
						var r = this,
							o = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting", "clear", "clearing"],
							s = ["opening", "closing", "selecting", "unselecting", "clearing"];
						t.call(this, n, i), n.on("*", function (t, n) {
							if (-1 !== e.inArray(t, o)) {
								n = n || {};
								var i = e.Event("select2:" + t, {
									params: n
								});
								r.$element.trigger(i), -1 !== e.inArray(t, s) && (n.prevented = i.isDefaultPrevented())
							}
						})
					}, t
				}), c.define("select2/translation", ["jquery", "require"], function (e, t) {
					function n(e) {
						this.dict = e || {}
					}
					return n.prototype.all = function () {
						return this.dict
					}, n.prototype.get = function (e) {
						return this.dict[e]
					}, n.prototype.extend = function (t) {
						this.dict = e.extend({}, t.all(), this.dict)
					}, n._cache = {}, n.loadPath = function (e) {
						if (!(e in n._cache)) {
							var i = t(e);
							n._cache[e] = i
						}
						return new n(n._cache[e])
					}, n
				}), c.define("select2/diacritics", [], function () {
					return {
						"\u24b6": "A",
						"\uff21": "A",
						"\xc0": "A",
						"\xc1": "A",
						"\xc2": "A",
						"\u1ea6": "A",
						"\u1ea4": "A",
						"\u1eaa": "A",
						"\u1ea8": "A",
						"\xc3": "A",
						"\u0100": "A",
						"\u0102": "A",
						"\u1eb0": "A",
						"\u1eae": "A",
						"\u1eb4": "A",
						"\u1eb2": "A",
						"\u0226": "A",
						"\u01e0": "A",
						"\xc4": "A",
						"\u01de": "A",
						"\u1ea2": "A",
						"\xc5": "A",
						"\u01fa": "A",
						"\u01cd": "A",
						"\u0200": "A",
						"\u0202": "A",
						"\u1ea0": "A",
						"\u1eac": "A",
						"\u1eb6": "A",
						"\u1e00": "A",
						"\u0104": "A",
						"\u023a": "A",
						"\u2c6f": "A",
						"\ua732": "AA",
						"\xc6": "AE",
						"\u01fc": "AE",
						"\u01e2": "AE",
						"\ua734": "AO",
						"\ua736": "AU",
						"\ua738": "AV",
						"\ua73a": "AV",
						"\ua73c": "AY",
						"\u24b7": "B",
						"\uff22": "B",
						"\u1e02": "B",
						"\u1e04": "B",
						"\u1e06": "B",
						"\u0243": "B",
						"\u0182": "B",
						"\u0181": "B",
						"\u24b8": "C",
						"\uff23": "C",
						"\u0106": "C",
						"\u0108": "C",
						"\u010a": "C",
						"\u010c": "C",
						"\xc7": "C",
						"\u1e08": "C",
						"\u0187": "C",
						"\u023b": "C",
						"\ua73e": "C",
						"\u24b9": "D",
						"\uff24": "D",
						"\u1e0a": "D",
						"\u010e": "D",
						"\u1e0c": "D",
						"\u1e10": "D",
						"\u1e12": "D",
						"\u1e0e": "D",
						"\u0110": "D",
						"\u018b": "D",
						"\u018a": "D",
						"\u0189": "D",
						"\ua779": "D",
						"\u01f1": "DZ",
						"\u01c4": "DZ",
						"\u01f2": "Dz",
						"\u01c5": "Dz",
						"\u24ba": "E",
						"\uff25": "E",
						"\xc8": "E",
						"\xc9": "E",
						"\xca": "E",
						"\u1ec0": "E",
						"\u1ebe": "E",
						"\u1ec4": "E",
						"\u1ec2": "E",
						"\u1ebc": "E",
						"\u0112": "E",
						"\u1e14": "E",
						"\u1e16": "E",
						"\u0114": "E",
						"\u0116": "E",
						"\xcb": "E",
						"\u1eba": "E",
						"\u011a": "E",
						"\u0204": "E",
						"\u0206": "E",
						"\u1eb8": "E",
						"\u1ec6": "E",
						"\u0228": "E",
						"\u1e1c": "E",
						"\u0118": "E",
						"\u1e18": "E",
						"\u1e1a": "E",
						"\u0190": "E",
						"\u018e": "E",
						"\u24bb": "F",
						"\uff26": "F",
						"\u1e1e": "F",
						"\u0191": "F",
						"\ua77b": "F",
						"\u24bc": "G",
						"\uff27": "G",
						"\u01f4": "G",
						"\u011c": "G",
						"\u1e20": "G",
						"\u011e": "G",
						"\u0120": "G",
						"\u01e6": "G",
						"\u0122": "G",
						"\u01e4": "G",
						"\u0193": "G",
						"\ua7a0": "G",
						"\ua77d": "G",
						"\ua77e": "G",
						"\u24bd": "H",
						"\uff28": "H",
						"\u0124": "H",
						"\u1e22": "H",
						"\u1e26": "H",
						"\u021e": "H",
						"\u1e24": "H",
						"\u1e28": "H",
						"\u1e2a": "H",
						"\u0126": "H",
						"\u2c67": "H",
						"\u2c75": "H",
						"\ua78d": "H",
						"\u24be": "I",
						"\uff29": "I",
						"\xcc": "I",
						"\xcd": "I",
						"\xce": "I",
						"\u0128": "I",
						"\u012a": "I",
						"\u012c": "I",
						"\u0130": "I",
						"\xcf": "I",
						"\u1e2e": "I",
						"\u1ec8": "I",
						"\u01cf": "I",
						"\u0208": "I",
						"\u020a": "I",
						"\u1eca": "I",
						"\u012e": "I",
						"\u1e2c": "I",
						"\u0197": "I",
						"\u24bf": "J",
						"\uff2a": "J",
						"\u0134": "J",
						"\u0248": "J",
						"\u24c0": "K",
						"\uff2b": "K",
						"\u1e30": "K",
						"\u01e8": "K",
						"\u1e32": "K",
						"\u0136": "K",
						"\u1e34": "K",
						"\u0198": "K",
						"\u2c69": "K",
						"\ua740": "K",
						"\ua742": "K",
						"\ua744": "K",
						"\ua7a2": "K",
						"\u24c1": "L",
						"\uff2c": "L",
						"\u013f": "L",
						"\u0139": "L",
						"\u013d": "L",
						"\u1e36": "L",
						"\u1e38": "L",
						"\u013b": "L",
						"\u1e3c": "L",
						"\u1e3a": "L",
						"\u0141": "L",
						"\u023d": "L",
						"\u2c62": "L",
						"\u2c60": "L",
						"\ua748": "L",
						"\ua746": "L",
						"\ua780": "L",
						"\u01c7": "LJ",
						"\u01c8": "Lj",
						"\u24c2": "M",
						"\uff2d": "M",
						"\u1e3e": "M",
						"\u1e40": "M",
						"\u1e42": "M",
						"\u2c6e": "M",
						"\u019c": "M",
						"\u24c3": "N",
						"\uff2e": "N",
						"\u01f8": "N",
						"\u0143": "N",
						"\xd1": "N",
						"\u1e44": "N",
						"\u0147": "N",
						"\u1e46": "N",
						"\u0145": "N",
						"\u1e4a": "N",
						"\u1e48": "N",
						"\u0220": "N",
						"\u019d": "N",
						"\ua790": "N",
						"\ua7a4": "N",
						"\u01ca": "NJ",
						"\u01cb": "Nj",
						"\u24c4": "O",
						"\uff2f": "O",
						"\xd2": "O",
						"\xd3": "O",
						"\xd4": "O",
						"\u1ed2": "O",
						"\u1ed0": "O",
						"\u1ed6": "O",
						"\u1ed4": "O",
						"\xd5": "O",
						"\u1e4c": "O",
						"\u022c": "O",
						"\u1e4e": "O",
						"\u014c": "O",
						"\u1e50": "O",
						"\u1e52": "O",
						"\u014e": "O",
						"\u022e": "O",
						"\u0230": "O",
						"\xd6": "O",
						"\u022a": "O",
						"\u1ece": "O",
						"\u0150": "O",
						"\u01d1": "O",
						"\u020c": "O",
						"\u020e": "O",
						"\u01a0": "O",
						"\u1edc": "O",
						"\u1eda": "O",
						"\u1ee0": "O",
						"\u1ede": "O",
						"\u1ee2": "O",
						"\u1ecc": "O",
						"\u1ed8": "O",
						"\u01ea": "O",
						"\u01ec": "O",
						"\xd8": "O",
						"\u01fe": "O",
						"\u0186": "O",
						"\u019f": "O",
						"\ua74a": "O",
						"\ua74c": "O",
						"\u0152": "OE",
						"\u01a2": "OI",
						"\ua74e": "OO",
						"\u0222": "OU",
						"\u24c5": "P",
						"\uff30": "P",
						"\u1e54": "P",
						"\u1e56": "P",
						"\u01a4": "P",
						"\u2c63": "P",
						"\ua750": "P",
						"\ua752": "P",
						"\ua754": "P",
						"\u24c6": "Q",
						"\uff31": "Q",
						"\ua756": "Q",
						"\ua758": "Q",
						"\u024a": "Q",
						"\u24c7": "R",
						"\uff32": "R",
						"\u0154": "R",
						"\u1e58": "R",
						"\u0158": "R",
						"\u0210": "R",
						"\u0212": "R",
						"\u1e5a": "R",
						"\u1e5c": "R",
						"\u0156": "R",
						"\u1e5e": "R",
						"\u024c": "R",
						"\u2c64": "R",
						"\ua75a": "R",
						"\ua7a6": "R",
						"\ua782": "R",
						"\u24c8": "S",
						"\uff33": "S",
						"\u1e9e": "S",
						"\u015a": "S",
						"\u1e64": "S",
						"\u015c": "S",
						"\u1e60": "S",
						"\u0160": "S",
						"\u1e66": "S",
						"\u1e62": "S",
						"\u1e68": "S",
						"\u0218": "S",
						"\u015e": "S",
						"\u2c7e": "S",
						"\ua7a8": "S",
						"\ua784": "S",
						"\u24c9": "T",
						"\uff34": "T",
						"\u1e6a": "T",
						"\u0164": "T",
						"\u1e6c": "T",
						"\u021a": "T",
						"\u0162": "T",
						"\u1e70": "T",
						"\u1e6e": "T",
						"\u0166": "T",
						"\u01ac": "T",
						"\u01ae": "T",
						"\u023e": "T",
						"\ua786": "T",
						"\ua728": "TZ",
						"\u24ca": "U",
						"\uff35": "U",
						"\xd9": "U",
						"\xda": "U",
						"\xdb": "U",
						"\u0168": "U",
						"\u1e78": "U",
						"\u016a": "U",
						"\u1e7a": "U",
						"\u016c": "U",
						"\xdc": "U",
						"\u01db": "U",
						"\u01d7": "U",
						"\u01d5": "U",
						"\u01d9": "U",
						"\u1ee6": "U",
						"\u016e": "U",
						"\u0170": "U",
						"\u01d3": "U",
						"\u0214": "U",
						"\u0216": "U",
						"\u01af": "U",
						"\u1eea": "U",
						"\u1ee8": "U",
						"\u1eee": "U",
						"\u1eec": "U",
						"\u1ef0": "U",
						"\u1ee4": "U",
						"\u1e72": "U",
						"\u0172": "U",
						"\u1e76": "U",
						"\u1e74": "U",
						"\u0244": "U",
						"\u24cb": "V",
						"\uff36": "V",
						"\u1e7c": "V",
						"\u1e7e": "V",
						"\u01b2": "V",
						"\ua75e": "V",
						"\u0245": "V",
						"\ua760": "VY",
						"\u24cc": "W",
						"\uff37": "W",
						"\u1e80": "W",
						"\u1e82": "W",
						"\u0174": "W",
						"\u1e86": "W",
						"\u1e84": "W",
						"\u1e88": "W",
						"\u2c72": "W",
						"\u24cd": "X",
						"\uff38": "X",
						"\u1e8a": "X",
						"\u1e8c": "X",
						"\u24ce": "Y",
						"\uff39": "Y",
						"\u1ef2": "Y",
						"\xdd": "Y",
						"\u0176": "Y",
						"\u1ef8": "Y",
						"\u0232": "Y",
						"\u1e8e": "Y",
						"\u0178": "Y",
						"\u1ef6": "Y",
						"\u1ef4": "Y",
						"\u01b3": "Y",
						"\u024e": "Y",
						"\u1efe": "Y",
						"\u24cf": "Z",
						"\uff3a": "Z",
						"\u0179": "Z",
						"\u1e90": "Z",
						"\u017b": "Z",
						"\u017d": "Z",
						"\u1e92": "Z",
						"\u1e94": "Z",
						"\u01b5": "Z",
						"\u0224": "Z",
						"\u2c7f": "Z",
						"\u2c6b": "Z",
						"\ua762": "Z",
						"\u24d0": "a",
						"\uff41": "a",
						"\u1e9a": "a",
						"\xe0": "a",
						"\xe1": "a",
						"\xe2": "a",
						"\u1ea7": "a",
						"\u1ea5": "a",
						"\u1eab": "a",
						"\u1ea9": "a",
						"\xe3": "a",
						"\u0101": "a",
						"\u0103": "a",
						"\u1eb1": "a",
						"\u1eaf": "a",
						"\u1eb5": "a",
						"\u1eb3": "a",
						"\u0227": "a",
						"\u01e1": "a",
						"\xe4": "a",
						"\u01df": "a",
						"\u1ea3": "a",
						"\xe5": "a",
						"\u01fb": "a",
						"\u01ce": "a",
						"\u0201": "a",
						"\u0203": "a",
						"\u1ea1": "a",
						"\u1ead": "a",
						"\u1eb7": "a",
						"\u1e01": "a",
						"\u0105": "a",
						"\u2c65": "a",
						"\u0250": "a",
						"\ua733": "aa",
						"\xe6": "ae",
						"\u01fd": "ae",
						"\u01e3": "ae",
						"\ua735": "ao",
						"\ua737": "au",
						"\ua739": "av",
						"\ua73b": "av",
						"\ua73d": "ay",
						"\u24d1": "b",
						"\uff42": "b",
						"\u1e03": "b",
						"\u1e05": "b",
						"\u1e07": "b",
						"\u0180": "b",
						"\u0183": "b",
						"\u0253": "b",
						"\u24d2": "c",
						"\uff43": "c",
						"\u0107": "c",
						"\u0109": "c",
						"\u010b": "c",
						"\u010d": "c",
						"\xe7": "c",
						"\u1e09": "c",
						"\u0188": "c",
						"\u023c": "c",
						"\ua73f": "c",
						"\u2184": "c",
						"\u24d3": "d",
						"\uff44": "d",
						"\u1e0b": "d",
						"\u010f": "d",
						"\u1e0d": "d",
						"\u1e11": "d",
						"\u1e13": "d",
						"\u1e0f": "d",
						"\u0111": "d",
						"\u018c": "d",
						"\u0256": "d",
						"\u0257": "d",
						"\ua77a": "d",
						"\u01f3": "dz",
						"\u01c6": "dz",
						"\u24d4": "e",
						"\uff45": "e",
						"\xe8": "e",
						"\xe9": "e",
						"\xea": "e",
						"\u1ec1": "e",
						"\u1ebf": "e",
						"\u1ec5": "e",
						"\u1ec3": "e",
						"\u1ebd": "e",
						"\u0113": "e",
						"\u1e15": "e",
						"\u1e17": "e",
						"\u0115": "e",
						"\u0117": "e",
						"\xeb": "e",
						"\u1ebb": "e",
						"\u011b": "e",
						"\u0205": "e",
						"\u0207": "e",
						"\u1eb9": "e",
						"\u1ec7": "e",
						"\u0229": "e",
						"\u1e1d": "e",
						"\u0119": "e",
						"\u1e19": "e",
						"\u1e1b": "e",
						"\u0247": "e",
						"\u025b": "e",
						"\u01dd": "e",
						"\u24d5": "f",
						"\uff46": "f",
						"\u1e1f": "f",
						"\u0192": "f",
						"\ua77c": "f",
						"\u24d6": "g",
						"\uff47": "g",
						"\u01f5": "g",
						"\u011d": "g",
						"\u1e21": "g",
						"\u011f": "g",
						"\u0121": "g",
						"\u01e7": "g",
						"\u0123": "g",
						"\u01e5": "g",
						"\u0260": "g",
						"\ua7a1": "g",
						"\u1d79": "g",
						"\ua77f": "g",
						"\u24d7": "h",
						"\uff48": "h",
						"\u0125": "h",
						"\u1e23": "h",
						"\u1e27": "h",
						"\u021f": "h",
						"\u1e25": "h",
						"\u1e29": "h",
						"\u1e2b": "h",
						"\u1e96": "h",
						"\u0127": "h",
						"\u2c68": "h",
						"\u2c76": "h",
						"\u0265": "h",
						"\u0195": "hv",
						"\u24d8": "i",
						"\uff49": "i",
						"\xec": "i",
						"\xed": "i",
						"\xee": "i",
						"\u0129": "i",
						"\u012b": "i",
						"\u012d": "i",
						"\xef": "i",
						"\u1e2f": "i",
						"\u1ec9": "i",
						"\u01d0": "i",
						"\u0209": "i",
						"\u020b": "i",
						"\u1ecb": "i",
						"\u012f": "i",
						"\u1e2d": "i",
						"\u0268": "i",
						"\u0131": "i",
						"\u24d9": "j",
						"\uff4a": "j",
						"\u0135": "j",
						"\u01f0": "j",
						"\u0249": "j",
						"\u24da": "k",
						"\uff4b": "k",
						"\u1e31": "k",
						"\u01e9": "k",
						"\u1e33": "k",
						"\u0137": "k",
						"\u1e35": "k",
						"\u0199": "k",
						"\u2c6a": "k",
						"\ua741": "k",
						"\ua743": "k",
						"\ua745": "k",
						"\ua7a3": "k",
						"\u24db": "l",
						"\uff4c": "l",
						"\u0140": "l",
						"\u013a": "l",
						"\u013e": "l",
						"\u1e37": "l",
						"\u1e39": "l",
						"\u013c": "l",
						"\u1e3d": "l",
						"\u1e3b": "l",
						"\u017f": "l",
						"\u0142": "l",
						"\u019a": "l",
						"\u026b": "l",
						"\u2c61": "l",
						"\ua749": "l",
						"\ua781": "l",
						"\ua747": "l",
						"\u01c9": "lj",
						"\u24dc": "m",
						"\uff4d": "m",
						"\u1e3f": "m",
						"\u1e41": "m",
						"\u1e43": "m",
						"\u0271": "m",
						"\u026f": "m",
						"\u24dd": "n",
						"\uff4e": "n",
						"\u01f9": "n",
						"\u0144": "n",
						"\xf1": "n",
						"\u1e45": "n",
						"\u0148": "n",
						"\u1e47": "n",
						"\u0146": "n",
						"\u1e4b": "n",
						"\u1e49": "n",
						"\u019e": "n",
						"\u0272": "n",
						"\u0149": "n",
						"\ua791": "n",
						"\ua7a5": "n",
						"\u01cc": "nj",
						"\u24de": "o",
						"\uff4f": "o",
						"\xf2": "o",
						"\xf3": "o",
						"\xf4": "o",
						"\u1ed3": "o",
						"\u1ed1": "o",
						"\u1ed7": "o",
						"\u1ed5": "o",
						"\xf5": "o",
						"\u1e4d": "o",
						"\u022d": "o",
						"\u1e4f": "o",
						"\u014d": "o",
						"\u1e51": "o",
						"\u1e53": "o",
						"\u014f": "o",
						"\u022f": "o",
						"\u0231": "o",
						"\xf6": "o",
						"\u022b": "o",
						"\u1ecf": "o",
						"\u0151": "o",
						"\u01d2": "o",
						"\u020d": "o",
						"\u020f": "o",
						"\u01a1": "o",
						"\u1edd": "o",
						"\u1edb": "o",
						"\u1ee1": "o",
						"\u1edf": "o",
						"\u1ee3": "o",
						"\u1ecd": "o",
						"\u1ed9": "o",
						"\u01eb": "o",
						"\u01ed": "o",
						"\xf8": "o",
						"\u01ff": "o",
						"\u0254": "o",
						"\ua74b": "o",
						"\ua74d": "o",
						"\u0275": "o",
						"\u0153": "oe",
						"\u01a3": "oi",
						"\u0223": "ou",
						"\ua74f": "oo",
						"\u24df": "p",
						"\uff50": "p",
						"\u1e55": "p",
						"\u1e57": "p",
						"\u01a5": "p",
						"\u1d7d": "p",
						"\ua751": "p",
						"\ua753": "p",
						"\ua755": "p",
						"\u24e0": "q",
						"\uff51": "q",
						"\u024b": "q",
						"\ua757": "q",
						"\ua759": "q",
						"\u24e1": "r",
						"\uff52": "r",
						"\u0155": "r",
						"\u1e59": "r",
						"\u0159": "r",
						"\u0211": "r",
						"\u0213": "r",
						"\u1e5b": "r",
						"\u1e5d": "r",
						"\u0157": "r",
						"\u1e5f": "r",
						"\u024d": "r",
						"\u027d": "r",
						"\ua75b": "r",
						"\ua7a7": "r",
						"\ua783": "r",
						"\u24e2": "s",
						"\uff53": "s",
						"\xdf": "s",
						"\u015b": "s",
						"\u1e65": "s",
						"\u015d": "s",
						"\u1e61": "s",
						"\u0161": "s",
						"\u1e67": "s",
						"\u1e63": "s",
						"\u1e69": "s",
						"\u0219": "s",
						"\u015f": "s",
						"\u023f": "s",
						"\ua7a9": "s",
						"\ua785": "s",
						"\u1e9b": "s",
						"\u24e3": "t",
						"\uff54": "t",
						"\u1e6b": "t",
						"\u1e97": "t",
						"\u0165": "t",
						"\u1e6d": "t",
						"\u021b": "t",
						"\u0163": "t",
						"\u1e71": "t",
						"\u1e6f": "t",
						"\u0167": "t",
						"\u01ad": "t",
						"\u0288": "t",
						"\u2c66": "t",
						"\ua787": "t",
						"\ua729": "tz",
						"\u24e4": "u",
						"\uff55": "u",
						"\xf9": "u",
						"\xfa": "u",
						"\xfb": "u",
						"\u0169": "u",
						"\u1e79": "u",
						"\u016b": "u",
						"\u1e7b": "u",
						"\u016d": "u",
						"\xfc": "u",
						"\u01dc": "u",
						"\u01d8": "u",
						"\u01d6": "u",
						"\u01da": "u",
						"\u1ee7": "u",
						"\u016f": "u",
						"\u0171": "u",
						"\u01d4": "u",
						"\u0215": "u",
						"\u0217": "u",
						"\u01b0": "u",
						"\u1eeb": "u",
						"\u1ee9": "u",
						"\u1eef": "u",
						"\u1eed": "u",
						"\u1ef1": "u",
						"\u1ee5": "u",
						"\u1e73": "u",
						"\u0173": "u",
						"\u1e77": "u",
						"\u1e75": "u",
						"\u0289": "u",
						"\u24e5": "v",
						"\uff56": "v",
						"\u1e7d": "v",
						"\u1e7f": "v",
						"\u028b": "v",
						"\ua75f": "v",
						"\u028c": "v",
						"\ua761": "vy",
						"\u24e6": "w",
						"\uff57": "w",
						"\u1e81": "w",
						"\u1e83": "w",
						"\u0175": "w",
						"\u1e87": "w",
						"\u1e85": "w",
						"\u1e98": "w",
						"\u1e89": "w",
						"\u2c73": "w",
						"\u24e7": "x",
						"\uff58": "x",
						"\u1e8b": "x",
						"\u1e8d": "x",
						"\u24e8": "y",
						"\uff59": "y",
						"\u1ef3": "y",
						"\xfd": "y",
						"\u0177": "y",
						"\u1ef9": "y",
						"\u0233": "y",
						"\u1e8f": "y",
						"\xff": "y",
						"\u1ef7": "y",
						"\u1e99": "y",
						"\u1ef5": "y",
						"\u01b4": "y",
						"\u024f": "y",
						"\u1eff": "y",
						"\u24e9": "z",
						"\uff5a": "z",
						"\u017a": "z",
						"\u1e91": "z",
						"\u017c": "z",
						"\u017e": "z",
						"\u1e93": "z",
						"\u1e95": "z",
						"\u01b6": "z",
						"\u0225": "z",
						"\u0240": "z",
						"\u2c6c": "z",
						"\ua763": "z",
						"\u0386": "\u0391",
						"\u0388": "\u0395",
						"\u0389": "\u0397",
						"\u038a": "\u0399",
						"\u03aa": "\u0399",
						"\u038c": "\u039f",
						"\u038e": "\u03a5",
						"\u03ab": "\u03a5",
						"\u038f": "\u03a9",
						"\u03ac": "\u03b1",
						"\u03ad": "\u03b5",
						"\u03ae": "\u03b7",
						"\u03af": "\u03b9",
						"\u03ca": "\u03b9",
						"\u0390": "\u03b9",
						"\u03cc": "\u03bf",
						"\u03cd": "\u03c5",
						"\u03cb": "\u03c5",
						"\u03b0": "\u03c5",
						"\u03ce": "\u03c9",
						"\u03c2": "\u03c3",
						"\u2019": "'"
					}
				}), c.define("select2/data/base", ["../utils"], function (e) {
					function t() {
						t.__super__.constructor.call(this)
					}
					return e.Extend(t, e.Observable), t.prototype.current = function () {
						throw new Error("The `current` method must be defined in child classes.")
					}, t.prototype.query = function () {
						throw new Error("The `query` method must be defined in child classes.")
					}, t.prototype.bind = function () {}, t.prototype.destroy = function () {}, t.prototype.generateResultId = function (t, n) {
						var i = t.id + "-result-";
						return i += e.generateChars(4), null != n.id ? i += "-" + n.id.toString() : i += "-" + e.generateChars(4), i
					}, t
				}), c.define("select2/data/select", ["./base", "../utils", "jquery"], function (e, t, n) {
					function i(e, t) {
						this.$element = e, this.options = t, i.__super__.constructor.call(this)
					}
					return t.Extend(i, e), i.prototype.current = function (e) {
						var t = [],
							i = this;
						this.$element.find(":selected").each(function () {
							var e = n(this),
								r = i.item(e);
							t.push(r)
						}), e(t)
					}, i.prototype.select = function (e) {
						var t = this;
						if (e.selected = !0, n(e.element).is("option")) return e.element.selected = !0, void this.$element.trigger("input").trigger("change");
						if (this.$element.prop("multiple")) this.current(function (i) {
							var r = [];
							(e = [e]).push.apply(e, i);
							for (var o = 0; o < e.length; o++) {
								var s = e[o].id; - 1 === n.inArray(s, r) && r.push(s)
							}
							t.$element.val(r), t.$element.trigger("input").trigger("change")
						});
						else {
							var i = e.id;
							this.$element.val(i), this.$element.trigger("input").trigger("change")
						}
					}, i.prototype.unselect = function (e) {
						var t = this;
						if (this.$element.prop("multiple")) {
							if (e.selected = !1, n(e.element).is("option")) return e.element.selected = !1, void this.$element.trigger("input").trigger("change");
							this.current(function (i) {
								for (var r = [], o = 0; o < i.length; o++) {
									var s = i[o].id;
									s !== e.id && -1 === n.inArray(s, r) && r.push(s)
								}
								t.$element.val(r), t.$element.trigger("input").trigger("change")
							})
						}
					}, i.prototype.bind = function (e) {
						var t = this;
						(this.container = e).on("select", function (e) {
							t.select(e.data)
						}), e.on("unselect", function (e) {
							t.unselect(e.data)
						})
					}, i.prototype.destroy = function () {
						this.$element.find("*").each(function () {
							t.RemoveData(this)
						})
					}, i.prototype.query = function (e, t) {
						var i = [],
							r = this;
						this.$element.children().each(function () {
							var t = n(this);
							if (t.is("option") || t.is("optgroup")) {
								var o = r.item(t),
									s = r.matches(e, o);
								null !== s && i.push(s)
							}
						}), t({
							results: i
						})
					}, i.prototype.addOptions = function (e) {
						t.appendMany(this.$element, e)
					}, i.prototype.option = function (e) {
						var i;
						e.children ? (i = document.createElement("optgroup")).label = e.text : void 0 !== (i = document.createElement("option")).textContent ? i.textContent = e.text : i.innerText = e.text, void 0 !== e.id && (i.value = e.id), e.disabled && (i.disabled = !0), e.selected && (i.selected = !0), e.title && (i.title = e.title);
						var r = n(i),
							o = this._normalizeItem(e);
						return o.element = i, t.StoreData(i, "data", o), r
					}, i.prototype.item = function (e) {
						var i = {};
						if (null != (i = t.GetData(e[0], "data"))) return i;
						if (e.is("option")) i = {
							id: e.val(),
							text: e.text(),
							disabled: e.prop("disabled"),
							selected: e.prop("selected"),
							title: e.prop("title")
						};
						else if (e.is("optgroup")) {
							i = {
								text: e.prop("label"),
								children: [],
								title: e.prop("title")
							};
							for (var r = e.children("option"), o = [], s = 0; s < r.length; s++) {
								var a = n(r[s]),
									c = this.item(a);
								o.push(c)
							}
							i.children = o
						}
						return (i = this._normalizeItem(i)).element = e[0], t.StoreData(e[0], "data", i), i
					}, i.prototype._normalizeItem = function (e) {
						return e !== Object(e) && (e = {
							id: e,
							text: e
						}), null != (e = n.extend({}, {
							text: ""
						}, e)).id && (e.id = e.id.toString()), null != e.text && (e.text = e.text.toString()), null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)), n.extend({}, {
							selected: !1,
							disabled: !1
						}, e)
					}, i.prototype.matches = function (e, t) {
						return this.options.get("matcher")(e, t)
					}, i
				}), c.define("select2/data/array", ["./select", "../utils", "jquery"], function (e, t, n) {
					function i(e, t) {
						this._dataToConvert = t.get("data") || [], i.__super__.constructor.call(this, e, t)
					}
					return t.Extend(i, e), i.prototype.bind = function (e, t) {
						i.__super__.bind.call(this, e, t), this.addOptions(this.convertToOptions(this._dataToConvert))
					}, i.prototype.select = function (e) {
						var t = this.$element.find("option").filter(function (t, n) {
							return n.value == e.id.toString()
						});
						0 === t.length && (t = this.option(e), this.addOptions(t)), i.__super__.select.call(this, e)
					}, i.prototype.convertToOptions = function (e) {
						function i(e) {
							return function () {
								return n(this).val() == e.id
							}
						}
						for (var r = this, o = this.$element.find("option"), s = o.map(function () {
								return r.item(n(this)).id
							}).get(), a = [], c = 0; c < e.length; c++) {
							var l = this._normalizeItem(e[c]);
							if (0 <= n.inArray(l.id, s)) {
								var d = o.filter(i(l)),
									u = this.item(d),
									p = n.extend(!0, {}, l, u),
									f = this.option(p);
								d.replaceWith(f)
							} else {
								var h = this.option(l);
								if (l.children) {
									var m = this.convertToOptions(l.children);
									t.appendMany(h, m)
								}
								a.push(h)
							}
						}
						return a
					}, i
				}), c.define("select2/data/ajax", ["./array", "../utils", "jquery"], function (e, t, n) {
					function i(e, t) {
						this.ajaxOptions = this._applyDefaults(t.get("ajax")), null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults), i.__super__.constructor.call(this, e, t)
					}
					return t.Extend(i, e), i.prototype._applyDefaults = function (e) {
						var t = {
							data: function (e) {
								return n.extend({}, e, {
									q: e.term
								})
							},
							transport: function (e, t, i) {
								var r = n.ajax(e);
								return r.then(t), r.fail(i), r
							}
						};
						return n.extend({}, t, e, !0)
					}, i.prototype.processResults = function (e) {
						return e
					}, i.prototype.query = function (e, t) {
						function i() {
							var i = o.transport(o, function (i) {
								var o = r.processResults(i, e);
								r.options.get("debug") && window.console && console.error && (o && o.results && n.isArray(o.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), t(o)
							}, function () {
								"status" in i && (0 === i.status || "0" === i.status) || r.trigger("results:message", {
									message: "errorLoading"
								})
							});
							r._request = i
						}
						var r = this;
						null != this._request && (n.isFunction(this._request.abort) && this._request.abort(), this._request = null);
						var o = n.extend({
							type: "GET"
						}, this.ajaxOptions);
						"function" == typeof o.url && (o.url = o.url.call(this.$element, e)), "function" == typeof o.data && (o.data = o.data.call(this.$element, e)), this.ajaxOptions.delay && null != e.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout), this._queryTimeout = window.setTimeout(i, this.ajaxOptions.delay)) : i()
					}, i
				}), c.define("select2/data/tags", ["jquery"], function (e) {
					function t(t, n, i) {
						var r = i.get("tags"),
							o = i.get("createTag");
						void 0 !== o && (this.createTag = o);
						var s = i.get("insertTag");
						if (void 0 !== s && (this.insertTag = s), t.call(this, n, i), e.isArray(r))
							for (var a = 0; a < r.length; a++) {
								var c = r[a],
									l = this._normalizeItem(c),
									d = this.option(l);
								this.$element.append(d)
							}
					}
					return t.prototype.query = function (e, t, n) {
						var i = this;
						this._removeOldTags(), null != t.term && null == t.page ? e.call(this, t, function r(e, o) {
							for (var s = e.results, a = 0; a < s.length; a++) {
								var c = s[a],
									l = null != c.children && !r({
										results: c.children
									}, !0);
								if ((c.text || "").toUpperCase() === (t.term || "").toUpperCase() || l) return !o && (e.data = s, void n(e))
							}
							if (o) return !0;
							var d = i.createTag(t);
							if (null != d) {
								var u = i.option(d);
								u.attr("data-select2-tag", !0), i.addOptions([u]), i.insertTag(s, d)
							}
							e.results = s, n(e)
						}) : e.call(this, t, n)
					}, t.prototype.createTag = function (t, n) {
						var i = e.trim(n.term);
						return "" === i ? null : {
							id: i,
							text: i
						}
					}, t.prototype.insertTag = function (e, t, n) {
						t.unshift(n)
					}, t.prototype._removeOldTags = function () {
						this.$element.find("option[data-select2-tag]").each(function () {
							this.selected || e(this).remove()
						})
					}, t
				}), c.define("select2/data/tokenizer", ["jquery"], function (e) {
					function t(e, t, n) {
						var i = n.get("tokenizer");
						void 0 !== i && (this.tokenizer = i), e.call(this, t, n)
					}
					return t.prototype.bind = function (e, t, n) {
						e.call(this, t, n), this.$search = t.dropdown.$search || t.selection.$search || n.find(".select2-search__field")
					}, t.prototype.query = function (t, n, i) {
						var r = this;
						n.term = n.term || "";
						var o = this.tokenizer(n, this.options, function (t) {
							var n, i = r._normalizeItem(t);
							if (!r.$element.find("option").filter(function () {
									return e(this).val() === i.id
								}).length) {
								var o = r.option(i);
								o.attr("data-select2-tag", !0), r._removeOldTags(), r.addOptions([o])
							}
							n = i, r.trigger("select", {
								data: n
							})
						});
						o.term !== n.term && (this.$search.length && (this.$search.val(o.term), this.$search.trigger("focus")), n.term = o.term), t.call(this, n, i)
					}, t.prototype.tokenizer = function (t, n, i, r) {
						for (var o = i.get("tokenSeparators") || [], s = n.term, a = 0, c = this.createTag || function (e) {
								return {
									id: e.term,
									text: e.term
								}
							}; a < s.length;) {
							var l = s[a];
							if (-1 !== e.inArray(l, o)) {
								var d = s.substr(0, a),
									u = c(e.extend({}, n, {
										term: d
									}));
								null != u ? (r(u), s = s.substr(a + 1) || "", a = 0) : a++
							} else a++
						}
						return {
							term: s
						}
					}, t
				}), c.define("select2/data/minimumInputLength", [], function () {
					function e(e, t, n) {
						this.minimumInputLength = n.get("minimumInputLength"), e.call(this, t, n)
					}
					return e.prototype.query = function (e, t, n) {
						t.term = t.term || "", t.term.length < this.minimumInputLength ? this.trigger("results:message", {
							message: "inputTooShort",
							args: {
								minimum: this.minimumInputLength,
								input: t.term,
								params: t
							}
						}) : e.call(this, t, n)
					}, e
				}), c.define("select2/data/maximumInputLength", [], function () {
					function e(e, t, n) {
						this.maximumInputLength = n.get("maximumInputLength"), e.call(this, t, n)
					}
					return e.prototype.query = function (e, t, n) {
						t.term = t.term || "", 0 < this.maximumInputLength && t.term.length > this.maximumInputLength ? this.trigger("results:message", {
							message: "inputTooLong",
							args: {
								maximum: this.maximumInputLength,
								input: t.term,
								params: t
							}
						}) : e.call(this, t, n)
					}, e
				}), c.define("select2/data/maximumSelectionLength", [], function () {
					function e(e, t, n) {
						this.maximumSelectionLength = n.get("maximumSelectionLength"), e.call(this, t, n)
					}
					return e.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), t.on("select", function () {
							i._checkIfMaximumSelected()
						})
					}, e.prototype.query = function (e, t, n) {
						var i = this;
						this._checkIfMaximumSelected(function () {
							e.call(i, t, n)
						})
					}, e.prototype._checkIfMaximumSelected = function (e, t) {
						var n = this;
						this.current(function (e) {
							var i = null != e ? e.length : 0;
							0 < n.maximumSelectionLength && i >= n.maximumSelectionLength ? n.trigger("results:message", {
								message: "maximumSelected",
								args: {
									maximum: n.maximumSelectionLength
								}
							}) : t && t()
						})
					}, e
				}), c.define("select2/dropdown", ["jquery", "./utils"], function (e, t) {
					function n(e, t) {
						this.$element = e, this.options = t, n.__super__.constructor.call(this)
					}
					return t.Extend(n, t.Observable), n.prototype.render = function () {
						var t = e('<span class="select2-dropdown"><span class="select2-results"></span></span>');
						return t.attr("dir", this.options.get("dir")), this.$dropdown = t
					}, n.prototype.bind = function () {}, n.prototype.position = function () {}, n.prototype.destroy = function () {
						this.$dropdown.remove()
					}, n
				}), c.define("select2/dropdown/search", ["jquery", "../utils"], function (e) {
					function t() {}
					return t.prototype.render = function (t) {
						var n = t.call(this),
							i = e('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>');
						return this.$searchContainer = i, this.$search = i.find("input"), n.prepend(i), n
					}, t.prototype.bind = function (t, n, i) {
						var r = this,
							o = n.id + "-results";
						t.call(this, n, i), this.$search.on("keydown", function (e) {
							r.trigger("keypress", e), r._keyUpPrevented = e.isDefaultPrevented()
						}), this.$search.on("input", function () {
							e(this).off("keyup")
						}), this.$search.on("keyup input", function (e) {
							r.handleSearch(e)
						}), n.on("open", function () {
							r.$search.attr("tabindex", 0), r.$search.attr("aria-controls", o), r.$search.trigger("focus"), window.setTimeout(function () {
								r.$search.trigger("focus")
							}, 0)
						}), n.on("close", function () {
							r.$search.attr("tabindex", -1), r.$search.removeAttr("aria-controls"), r.$search.removeAttr("aria-activedescendant"), r.$search.val(""), r.$search.trigger("blur")
						}), n.on("focus", function () {
							n.isOpen() || r.$search.trigger("focus")
						}), n.on("results:all", function (e) {
							null != e.query.term && "" !== e.query.term || (r.showSearch(e) ? r.$searchContainer.removeClass("select2-search--hide") : r.$searchContainer.addClass("select2-search--hide"))
						}), n.on("results:focus", function (e) {
							e.data._resultId ? r.$search.attr("aria-activedescendant", e.data._resultId) : r.$search.removeAttr("aria-activedescendant")
						})
					}, t.prototype.handleSearch = function () {
						if (!this._keyUpPrevented) {
							var e = this.$search.val();
							this.trigger("query", {
								term: e
							})
						}
						this._keyUpPrevented = !1
					}, t.prototype.showSearch = function () {
						return !0
					}, t
				}), c.define("select2/dropdown/hidePlaceholder", [], function () {
					function e(e, t, n, i) {
						this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n, i)
					}
					return e.prototype.append = function (e, t) {
						t.results = this.removePlaceholder(t.results), e.call(this, t)
					}, e.prototype.normalizePlaceholder = function (e, t) {
						return "string" == typeof t && (t = {
							id: "",
							text: t
						}), t
					}, e.prototype.removePlaceholder = function (e, t) {
						for (var n = t.slice(0), i = t.length - 1; 0 <= i; i--) {
							var r = t[i];
							this.placeholder.id === r.id && n.splice(i, 1)
						}
						return n
					}, e
				}), c.define("select2/dropdown/infiniteScroll", ["jquery"], function (e) {
					function t(e, t, n, i) {
						this.lastParams = {}, e.call(this, t, n, i), this.$loadingMore = this.createLoadingMore(), this.loading = !1
					}
					return t.prototype.append = function (e, t) {
						this.$loadingMore.remove(), this.loading = !1, e.call(this, t), this.showLoadingMore(t) && (this.$results.append(this.$loadingMore), this.loadMoreIfNeeded())
					}, t.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), t.on("query", function (e) {
							i.lastParams = e, i.loading = !0
						}), t.on("query:append", function (e) {
							i.lastParams = e, i.loading = !0
						}), this.$results.on("scroll", this.loadMoreIfNeeded.bind(this))
					}, t.prototype.loadMoreIfNeeded = function () {
						var t = e.contains(document.documentElement, this.$loadingMore[0]);
						if (!this.loading && t) {
							var n = this.$results.offset().top + this.$results.outerHeight(!1);
							this.$loadingMore.offset().top + this.$loadingMore.outerHeight(!1) <= n + 50 && this.loadMore()
						}
					}, t.prototype.loadMore = function () {
						this.loading = !0;
						var t = e.extend({}, {
							page: 1
						}, this.lastParams);
						t.page++, this.trigger("query:append", t)
					}, t.prototype.showLoadingMore = function (e, t) {
						return t.pagination && t.pagination.more
					}, t.prototype.createLoadingMore = function () {
						var t = e('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'),
							n = this.options.get("translations").get("loadingMore");
						return t.html(n(this.lastParams)), t
					}, t
				}), c.define("select2/dropdown/attachBody", ["jquery", "../utils"], function (e, t) {
					function n(t, n, i) {
						this.$dropdownParent = e(i.get("dropdownParent") || document.body), t.call(this, n, i)
					}
					return n.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), t.on("open", function () {
							i._showDropdown(), i._attachPositioningHandler(t), i._bindContainerResultHandlers(t)
						}), t.on("close", function () {
							i._hideDropdown(), i._detachPositioningHandler(t)
						}), this.$dropdownContainer.on("mousedown", function (e) {
							e.stopPropagation()
						})
					}, n.prototype.destroy = function (e) {
						e.call(this), this.$dropdownContainer.remove()
					}, n.prototype.position = function (e, t, n) {
						t.attr("class", n.attr("class")), t.removeClass("select2"), t.addClass("select2-container--open"), t.css({
							position: "absolute",
							top: -999999
						}), this.$container = n
					}, n.prototype.render = function (t) {
						var n = e("<span></span>"),
							i = t.call(this);
						return n.append(i), this.$dropdownContainer = n
					}, n.prototype._hideDropdown = function () {
						this.$dropdownContainer.detach()
					}, n.prototype._bindContainerResultHandlers = function (e, t) {
						if (!this._containerResultsHandlersBound) {
							var n = this;
							t.on("results:all", function () {
								n._positionDropdown(), n._resizeDropdown()
							}), t.on("results:append", function () {
								n._positionDropdown(), n._resizeDropdown()
							}), t.on("results:message", function () {
								n._positionDropdown(), n._resizeDropdown()
							}), t.on("select", function () {
								n._positionDropdown(), n._resizeDropdown()
							}), t.on("unselect", function () {
								n._positionDropdown(), n._resizeDropdown()
							}), this._containerResultsHandlersBound = !0
						}
					}, n.prototype._attachPositioningHandler = function (n, i) {
						var r = this,
							o = "scroll.select2." + i.id,
							s = "resize.select2." + i.id,
							a = "orientationchange.select2." + i.id,
							c = this.$container.parents().filter(t.hasScroll);
						c.each(function () {
							t.StoreData(this, "select2-scroll-position", {
								x: e(this).scrollLeft(),
								y: e(this).scrollTop()
							})
						}), c.on(o, function () {
							var n = t.GetData(this, "select2-scroll-position");
							e(this).scrollTop(n.y)
						}), e(window).on(o + " " + s + " " + a, function () {
							r._positionDropdown(), r._resizeDropdown()
						})
					}, n.prototype._detachPositioningHandler = function (n, i) {
						var r = "scroll.select2." + i.id,
							o = "resize.select2." + i.id,
							s = "orientationchange.select2." + i.id;
						this.$container.parents().filter(t.hasScroll).off(r), e(window).off(r + " " + o + " " + s)
					}, n.prototype._positionDropdown = function () {
						var t = e(window),
							n = this.$dropdown.hasClass("select2-dropdown--above"),
							i = this.$dropdown.hasClass("select2-dropdown--below"),
							r = null,
							o = this.$container.offset();
						o.bottom = o.top + this.$container.outerHeight(!1);
						var s = {
							height: this.$container.outerHeight(!1)
						};
						s.top = o.top, s.bottom = o.top + s.height;
						var a = this.$dropdown.outerHeight(!1),
							c = t.scrollTop(),
							l = t.scrollTop() + t.height(),
							d = c < o.top - a,
							u = l > o.bottom + a,
							p = {
								left: o.left,
								top: s.bottom
							},
							f = this.$dropdownParent;
						"static" === f.css("position") && (f = f.offsetParent());
						var h = {
							top: 0,
							left: 0
						};
						(e.contains(document.body, f[0]) || f[0].isConnected) && (h = f.offset()), p.top -= h.top, p.left -= h.left, n || i || (r = "below"), u || !d || n ? !d && u && n && (r = "below") : r = "above", ("above" == r || n && "below" !== r) && (p.top = s.top - h.top - a), null != r && (this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--" + r), this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--" + r)), this.$dropdownContainer.css(p)
					}, n.prototype._resizeDropdown = function () {
						var e = {
							width: this.$container.outerWidth(!1) + "px"
						};
						this.options.get("dropdownAutoWidth") && (e.minWidth = e.width, e.position = "relative", e.width = "auto"), this.$dropdown.css(e)
					}, n.prototype._showDropdown = function () {
						this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
					}, n
				}), c.define("select2/dropdown/minimumResultsForSearch", [], function () {
					function e(e, t, n, i) {
						this.minimumResultsForSearch = n.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0), e.call(this, t, n, i)
					}
					return e.prototype.showSearch = function (e, t) {
						return !(function n(e) {
							for (var t = 0, i = 0; i < e.length; i++) {
								var r = e[i];
								r.children ? t += n(r.children) : t++
							}
							return t
						}(t.data.results) < this.minimumResultsForSearch) && e.call(this, t)
					}, e
				}), c.define("select2/dropdown/selectOnClose", ["../utils"], function (e) {
					function t() {}
					return t.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), t.on("close", function (e) {
							i._handleSelectOnClose(e)
						})
					}, t.prototype._handleSelectOnClose = function (t, n) {
						if (n && null != n.originalSelect2Event) {
							var i = n.originalSelect2Event;
							if ("select" === i._type || "unselect" === i._type) return
						}
						var r = this.getHighlightedResults();
						if (!(r.length < 1)) {
							var o = e.GetData(r[0], "data");
							null != o.element && o.element.selected || null == o.element && o.selected || this.trigger("select", {
								data: o
							})
						}
					}, t
				}), c.define("select2/dropdown/closeOnSelect", [], function () {
					function e() {}
					return e.prototype.bind = function (e, t, n) {
						var i = this;
						e.call(this, t, n), t.on("select", function (e) {
							i._selectTriggered(e)
						}), t.on("unselect", function (e) {
							i._selectTriggered(e)
						})
					}, e.prototype._selectTriggered = function (e, t) {
						var n = t.originalEvent;
						n && (n.ctrlKey || n.metaKey) || this.trigger("close", {
							originalEvent: n,
							originalSelect2Event: t
						})
					}, e
				}), c.define("select2/i18n/en", [], function () {
					return {
						errorLoading: function () {
							return "The results could not be loaded."
						},
						inputTooLong: function (e) {
							var t = e.input.length - e.maximum,
								n = "Please delete " + t + " character";
							return 1 != t && (n += "s"), n
						},
						inputTooShort: function (e) {
							return "Please enter " + (e.minimum - e.input.length) + " or more characters"
						},
						loadingMore: function () {
							return "Loading more results\u2026"
						},
						maximumSelected: function (e) {
							var t = "You can only select " + e.maximum + " item";
							return 1 != e.maximum && (t += "s"), t
						},
						noResults: function () {
							return "No results found"
						},
						searching: function () {
							return "Searching\u2026"
						},
						removeAllItems: function () {
							return "Remove all items"
						}
					}
				}), c.define("select2/defaults", ["jquery", "require", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./i18n/en"], function (e, t, n, i, r, o, s, a, c, l, d, u, p, f, h, m, g, v, y, A, b, w, S, C, T, x, k, _) {
					function E() {
						this.reset()
					}
					return E.prototype.apply = function (d) {
						if (null == (d = e.extend(!0, {}, this.defaults, d)).dataAdapter) {
							if (null != d.ajax ? d.dataAdapter = h : null != d.data ? d.dataAdapter = f : d.dataAdapter = p, 0 < d.minimumInputLength && (d.dataAdapter = l.Decorate(d.dataAdapter, v)), 0 < d.maximumInputLength && (d.dataAdapter = l.Decorate(d.dataAdapter, y)), 0 < d.maximumSelectionLength && (d.dataAdapter = l.Decorate(d.dataAdapter, A)), d.tags && (d.dataAdapter = l.Decorate(d.dataAdapter, m)), null == d.tokenSeparators && null == d.tokenizer || (d.dataAdapter = l.Decorate(d.dataAdapter, g)), null != d.query) {
								var u = t(d.amdBase + "compat/query");
								d.dataAdapter = l.Decorate(d.dataAdapter, u)
							}
							if (null != d.initSelection) {
								var E = t(d.amdBase + "compat/initSelection");
								d.dataAdapter = l.Decorate(d.dataAdapter, E)
							}
						}
						if (null == d.resultsAdapter && (d.resultsAdapter = n, null != d.ajax && (d.resultsAdapter = l.Decorate(d.resultsAdapter, C)), null != d.placeholder && (d.resultsAdapter = l.Decorate(d.resultsAdapter, S)), d.selectOnClose && (d.resultsAdapter = l.Decorate(d.resultsAdapter, k))), null == d.dropdownAdapter) {
							if (d.multiple) d.dropdownAdapter = b;
							else {
								var P = l.Decorate(b, w);
								d.dropdownAdapter = P
							}
							if (0 !== d.minimumResultsForSearch && (d.dropdownAdapter = l.Decorate(d.dropdownAdapter, x)), d.closeOnSelect && (d.dropdownAdapter = l.Decorate(d.dropdownAdapter, _)), null != d.dropdownCssClass || null != d.dropdownCss || null != d.adaptDropdownCssClass) {
								var D = t(d.amdBase + "compat/dropdownCss");
								d.dropdownAdapter = l.Decorate(d.dropdownAdapter, D)
							}
							d.dropdownAdapter = l.Decorate(d.dropdownAdapter, T)
						}
						if (null == d.selectionAdapter) {
							if (d.multiple ? d.selectionAdapter = r : d.selectionAdapter = i, null != d.placeholder && (d.selectionAdapter = l.Decorate(d.selectionAdapter, o)), d.allowClear && (d.selectionAdapter = l.Decorate(d.selectionAdapter, s)), d.multiple && (d.selectionAdapter = l.Decorate(d.selectionAdapter, a)), null != d.containerCssClass || null != d.containerCss || null != d.adaptContainerCssClass) {
								var $ = t(d.amdBase + "compat/containerCss");
								d.selectionAdapter = l.Decorate(d.selectionAdapter, $)
							}
							d.selectionAdapter = l.Decorate(d.selectionAdapter, c)
						}
						d.language = this._resolveLanguage(d.language), d.language.push("en");
						for (var R = [], I = 0; I < d.language.length; I++) {
							var O = d.language[I]; - 1 === R.indexOf(O) && R.push(O)
						}
						return d.language = R, d.translations = this._processTranslations(d.language, d.debug), d
					}, E.prototype.reset = function () {
						function t(e) {
							return e.replace(/[^\u0000-\u007E]/g, function (e) {
								return u[e] || e
							})
						}
						this.defaults = {
							amdBase: "./",
							amdLanguageBase: "./i18n/",
							closeOnSelect: !0,
							debug: !1,
							dropdownAutoWidth: !1,
							escapeMarkup: l.escapeMarkup,
							language: {},
							matcher: function n(i, r) {
								if ("" === e.trim(i.term)) return r;
								if (r.children && 0 < r.children.length) {
									for (var o = e.extend(!0, {}, r), s = r.children.length - 1; 0 <= s; s--) null == n(i, r.children[s]) && o.children.splice(s, 1);
									return 0 < o.children.length ? o : n(i, o)
								}
								var a = t(r.text).toUpperCase(),
									c = t(i.term).toUpperCase();
								return -1 < a.indexOf(c) ? r : null
							},
							minimumInputLength: 0,
							maximumInputLength: 0,
							maximumSelectionLength: 0,
							minimumResultsForSearch: 0,
							selectOnClose: !1,
							scrollAfterSelect: !1,
							sorter: function (e) {
								return e
							},
							templateResult: function (e) {
								return e.text
							},
							templateSelection: function (e) {
								return e.text
							},
							theme: "default",
							width: "resolve"
						}
					}, E.prototype.applyFromElement = function (e, t) {
						var n = e.language,
							i = this.defaults.language,
							r = t.prop("lang"),
							o = t.closest("[lang]").prop("lang"),
							s = Array.prototype.concat.call(this._resolveLanguage(r), this._resolveLanguage(n), this._resolveLanguage(i), this._resolveLanguage(o));
						return e.language = s, e
					}, E.prototype._resolveLanguage = function (t) {
						if (!t) return [];
						if (e.isEmptyObject(t)) return [];
						if (e.isPlainObject(t)) return [t];
						var n;
						n = e.isArray(t) ? t : [t];
						for (var i = [], r = 0; r < n.length; r++)
							if (i.push(n[r]), "string" == typeof n[r] && 0 < n[r].indexOf("-")) {
								var o = n[r].split("-")[0];
								i.push(o)
							} return i
					}, E.prototype._processTranslations = function (t, n) {
						for (var i = new d, r = 0; r < t.length; r++) {
							var o = new d,
								s = t[r];
							if ("string" == typeof s) try {
								o = d.loadPath(s)
							} catch (t) {
								try {
									s = this.defaults.amdLanguageBase + s, o = d.loadPath(s)
								} catch (t) {
									n && window.console && console.warn && console.warn('Select2: The language file for "' + s + '" could not be automatically loaded. A fallback will be used instead.')
								}
							} else o = e.isPlainObject(s) ? new d(s) : s;
							i.extend(o)
						}
						return i
					}, E.prototype.set = function (t, n) {
						var i = {};
						i[e.camelCase(t)] = n;
						var r = l._convertData(i);
						e.extend(!0, this.defaults, r)
					}, new E
				}), c.define("select2/options", ["require", "jquery", "./defaults", "./utils"], function (e, t, n, i) {
					function r(t, r) {
						if (this.options = t, null != r && this.fromElement(r), null != r && (this.options = n.applyFromElement(this.options, r)), this.options = n.apply(this.options), r && r.is("input")) {
							var o = e(this.get("amdBase") + "compat/inputData");
							this.options.dataAdapter = i.Decorate(this.options.dataAdapter, o)
						}
					}
					return r.prototype.fromElement = function (e) {
						function n(e, t) {
							return t.toUpperCase()
						}
						var r = ["select2"];
						null == this.options.multiple && (this.options.multiple = e.prop("multiple")), null == this.options.disabled && (this.options.disabled = e.prop("disabled")), null == this.options.dir && (e.prop("dir") ? this.options.dir = e.prop("dir") : e.closest("[dir]").prop("dir") ? this.options.dir = e.closest("[dir]").prop("dir") : this.options.dir = "ltr"), e.prop("disabled", this.options.disabled), e.prop("multiple", this.options.multiple), i.GetData(e[0], "select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), i.StoreData(e[0], "data", i.GetData(e[0], "select2Tags")), i.StoreData(e[0], "tags", !0)), i.GetData(e[0], "ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), e.attr("ajax--url", i.GetData(e[0], "ajaxUrl")), i.StoreData(e[0], "ajax-Url", i.GetData(e[0], "ajaxUrl")));
						for (var o = {}, s = 0; s < e[0].attributes.length; s++) {
							var a = e[0].attributes[s].name,
								c = "data-";
							if (a.substr(0, c.length) == c) {
								var l = a.substring(c.length),
									d = i.GetData(e[0], l);
								o[l.replace(/-([a-z])/g, n)] = d
							}
						}
						t.fn.jquery && "1." == t.fn.jquery.substr(0, 2) && e[0].dataset && (o = t.extend(!0, {}, e[0].dataset, o));
						var u = t.extend(!0, {}, i.GetData(e[0]), o);
						for (var p in u = i._convertData(u)) - 1 < t.inArray(p, r) || (t.isPlainObject(this.options[p]) ? t.extend(this.options[p], u[p]) : this.options[p] = u[p]);
						return this
					}, r.prototype.get = function (e) {
						return this.options[e]
					}, r.prototype.set = function (e, t) {
						this.options[e] = t
					}, r
				}), c.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function (e, t, n, i) {
					var r = function (e, i) {
						null != n.GetData(e[0], "select2") && n.GetData(e[0], "select2").destroy(), this.$element = e, this.id = this._generateId(e), i = i || {}, this.options = new t(i, e), r.__super__.constructor.call(this);
						var o = e.attr("tabindex") || 0;
						n.StoreData(e[0], "old-tabindex", o), e.attr("tabindex", "-1");
						var s = this.options.get("dataAdapter");
						this.dataAdapter = new s(e, this.options);
						var a = this.render();
						this._placeContainer(a);
						var c = this.options.get("selectionAdapter");
						this.selection = new c(e, this.options), this.$selection = this.selection.render(), this.selection.position(this.$selection, a);
						var l = this.options.get("dropdownAdapter");
						this.dropdown = new l(e, this.options), this.$dropdown = this.dropdown.render(), this.dropdown.position(this.$dropdown, a);
						var d = this.options.get("resultsAdapter");
						this.results = new d(e, this.options, this.dataAdapter), this.$results = this.results.render(), this.results.position(this.$results, this.$dropdown);
						var u = this;
						this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function (e) {
							u.trigger("selection:update", {
								data: e
							})
						}), e.addClass("select2-hidden-accessible"), e.attr("aria-hidden", "true"), this._syncAttributes(), n.StoreData(e[0], "select2", this), e.data("select2", this)
					};
					return n.Extend(r, n.Observable), r.prototype._generateId = function (e) {
						return "select2-" + (null != e.attr("id") ? e.attr("id") : null != e.attr("name") ? e.attr("name") + "-" + n.generateChars(2) : n.generateChars(4)).replace(/(:|\.|\[|\]|,)/g, "")
					}, r.prototype._placeContainer = function (e) {
						e.insertAfter(this.$element);
						var t = this._resolveWidth(this.$element, this.options.get("width"));
						null != t && e.css("width", t)
					}, r.prototype._resolveWidth = function (e, t) {
						var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
						if ("resolve" == t) {
							var i = this._resolveWidth(e, "style");
							return null != i ? i : this._resolveWidth(e, "element")
						}
						if ("element" == t) {
							var r = e.outerWidth(!1);
							return r <= 0 ? "auto" : r + "px"
						}
						if ("style" != t) return "computedstyle" != t ? t : window.getComputedStyle(e[0]).width;
						var o = e.attr("style");
						if ("string" != typeof o) return null;
						for (var s = o.split(";"), a = 0, c = s.length; a < c; a += 1) {
							var l = s[a].replace(/\s/g, "").match(n);
							if (null !== l && 1 <= l.length) return l[1]
						}
						return null
					}, r.prototype._bindAdapters = function () {
						this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container)
					}, r.prototype._registerDomEvents = function () {
						var e = this;
						this.$element.on("change.select2", function () {
							e.dataAdapter.current(function (t) {
								e.trigger("selection:update", {
									data: t
								})
							})
						}), this.$element.on("focus.select2", function (t) {
							e.trigger("focus", t)
						}), this._syncA = n.bind(this._syncAttributes, this), this._syncS = n.bind(this._syncSubtree, this), this.$element[0].attachEvent && this.$element[0].attachEvent("onpropertychange", this._syncA);
						var t = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
						null != t ? (this._observer = new t(function (t) {
							e._syncA(), e._syncS(null, t)
						}), this._observer.observe(this.$element[0], {
							attributes: !0,
							childList: !0,
							subtree: !1
						})) : this.$element[0].addEventListener && (this.$element[0].addEventListener("DOMAttrModified", e._syncA, !1), this.$element[0].addEventListener("DOMNodeInserted", e._syncS, !1), this.$element[0].addEventListener("DOMNodeRemoved", e._syncS, !1))
					}, r.prototype._registerDataEvents = function () {
						var e = this;
						this.dataAdapter.on("*", function (t, n) {
							e.trigger(t, n)
						})
					}, r.prototype._registerSelectionEvents = function () {
						var t = this,
							n = ["toggle", "focus"];
						this.selection.on("toggle", function () {
							t.toggleDropdown()
						}), this.selection.on("focus", function (e) {
							t.focus(e)
						}), this.selection.on("*", function (i, r) {
							-1 === e.inArray(i, n) && t.trigger(i, r)
						})
					}, r.prototype._registerDropdownEvents = function () {
						var e = this;
						this.dropdown.on("*", function (t, n) {
							e.trigger(t, n)
						})
					}, r.prototype._registerResultsEvents = function () {
						var e = this;
						this.results.on("*", function (t, n) {
							e.trigger(t, n)
						})
					}, r.prototype._registerEvents = function () {
						var e = this;
						this.on("open", function () {
							e.$container.addClass("select2-container--open")
						}), this.on("close", function () {
							e.$container.removeClass("select2-container--open")
						}), this.on("enable", function () {
							e.$container.removeClass("select2-container--disabled")
						}), this.on("disable", function () {
							e.$container.addClass("select2-container--disabled")
						}), this.on("blur", function () {
							e.$container.removeClass("select2-container--focus")
						}), this.on("query", function (t) {
							e.isOpen() || e.trigger("open", {}), this.dataAdapter.query(t, function (n) {
								e.trigger("results:all", {
									data: n,
									query: t
								})
							})
						}), this.on("query:append", function (t) {
							this.dataAdapter.query(t, function (n) {
								e.trigger("results:append", {
									data: n,
									query: t
								})
							})
						}), this.on("keypress", function (t) {
							var n = t.which;
							e.isOpen() ? n === i.ESC || n === i.TAB || n === i.UP && t.altKey ? (e.close(t), t.preventDefault()) : n === i.ENTER ? (e.trigger("results:select", {}), t.preventDefault()) : n === i.SPACE && t.ctrlKey ? (e.trigger("results:toggle", {}), t.preventDefault()) : n === i.UP ? (e.trigger("results:previous", {}), t.preventDefault()) : n === i.DOWN && (e.trigger("results:next", {}), t.preventDefault()) : (n === i.ENTER || n === i.SPACE || n === i.DOWN && t.altKey) && (e.open(), t.preventDefault())
						})
					}, r.prototype._syncAttributes = function () {
						this.options.set("disabled", this.$element.prop("disabled")), this.isDisabled() ? (this.isOpen() && this.close(), this.trigger("disable", {})) : this.trigger("enable", {})
					}, r.prototype._isChangeMutation = function (t, n) {
						var i = !1,
							r = this;
						if (!t || !t.target || "OPTION" === t.target.nodeName || "OPTGROUP" === t.target.nodeName) {
							if (n)
								if (n.addedNodes && 0 < n.addedNodes.length)
									for (var o = 0; o < n.addedNodes.length; o++) n.addedNodes[o].selected && (i = !0);
								else n.removedNodes && 0 < n.removedNodes.length ? i = !0 : e.isArray(n) && e.each(n, function (e, t) {
									if (r._isChangeMutation(e, t)) return !(i = !0)
								});
							else i = !0;
							return i
						}
					}, r.prototype._syncSubtree = function (e, t) {
						var n = this._isChangeMutation(e, t),
							i = this;
						n && this.dataAdapter.current(function (e) {
							i.trigger("selection:update", {
								data: e
							})
						})
					}, r.prototype.trigger = function (e, t) {
						var n = r.__super__.trigger,
							i = {
								open: "opening",
								close: "closing",
								select: "selecting",
								unselect: "unselecting",
								clear: "clearing"
							};
						if (void 0 === t && (t = {}), e in i) {
							var o = i[e],
								s = {
									prevented: !1,
									name: e,
									args: t
								};
							if (n.call(this, o, s), s.prevented) return void(t.prevented = !0)
						}
						n.call(this, e, t)
					}, r.prototype.toggleDropdown = function () {
						this.isDisabled() || (this.isOpen() ? this.close() : this.open())
					}, r.prototype.open = function () {
						this.isOpen() || this.isDisabled() || this.trigger("query", {})
					}, r.prototype.close = function (e) {
						this.isOpen() && this.trigger("close", {
							originalEvent: e
						})
					}, r.prototype.isEnabled = function () {
						return !this.isDisabled()
					}, r.prototype.isDisabled = function () {
						return this.options.get("disabled")
					}, r.prototype.isOpen = function () {
						return this.$container.hasClass("select2-container--open")
					}, r.prototype.hasFocus = function () {
						return this.$container.hasClass("select2-container--focus")
					}, r.prototype.focus = function () {
						this.hasFocus() || (this.$container.addClass("select2-container--focus"), this.trigger("focus", {}))
					}, r.prototype.enable = function (e) {
						this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'), null != e && 0 !== e.length || (e = [!0]);
						var t = !e[0];
						this.$element.prop("disabled", t)
					}, r.prototype.data = function () {
						this.options.get("debug") && 0 < arguments.length && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
						var e = [];
						return this.dataAdapter.current(function (t) {
							e = t
						}), e
					}, r.prototype.val = function (t) {
						if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'), null == t || 0 === t.length) return this.$element.val();
						var n = t[0];
						e.isArray(n) && (n = e.map(n, function (e) {
							return e.toString()
						})), this.$element.val(n).trigger("input").trigger("change")
					}, r.prototype.destroy = function () {
						this.$container.remove(), this.$element[0].detachEvent && this.$element[0].detachEvent("onpropertychange", this._syncA), null != this._observer ? (this._observer.disconnect(), this._observer = null) : this.$element[0].removeEventListener && (this.$element[0].removeEventListener("DOMAttrModified", this._syncA, !1), this.$element[0].removeEventListener("DOMNodeInserted", this._syncS, !1), this.$element[0].removeEventListener("DOMNodeRemoved", this._syncS, !1)), this._syncA = null, this._syncS = null, this.$element.off(".select2"), this.$element.attr("tabindex", n.GetData(this.$element[0], "old-tabindex")), this.$element.removeClass("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), n.RemoveData(this.$element[0]), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter = null, this.selection = null, this.dropdown = null, this.results = null
					}, r.prototype.render = function () {
						var t = e('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
						return t.attr("dir", this.options.get("dir")), this.$container = t, this.$container.addClass("select2-container--" + this.options.get("theme")), n.StoreData(t[0], "element", this.$element), t
					}, r
				}), c.define("jquery-mousewheel", ["jquery"], function (e) {
					return e
				}), c.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults", "./select2/utils"], function (e, t, n, i, r) {
					if (null == e.fn.select2) {
						var o = ["open", "close", "destroy"];
						e.fn.select2 = function (t) {
							if ("object" == typeof (t = t || {})) return this.each(function () {
								var i = e.extend(!0, {}, t);
								new n(e(this), i)
							}), this;
							if ("string" != typeof t) throw new Error("Invalid arguments for Select2: " + t);
							var i, s = Array.prototype.slice.call(arguments, 1);
							return this.each(function () {
								var e = r.GetData(this, "select2");
								null == e && window.console && console.error && console.error("The select2('" + t + "') method was called on an element that is not using Select2."), i = e[t].apply(e, s)
							}), -1 < e.inArray(t, o) ? this : i
						}
					}
					return null == e.fn.select2.defaults && (e.fn.select2.defaults = i), n
				}), {
					define: c.define,
					require: c.require
				}
			}(),
			n = t.require("jquery.select2");
		return e.fn.select2.amd = t, n
	}),
	function (e) {
		"use strict";
		"function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
	}(function (e) {
		"use strict";
		var t = window.Slick || {};
		(t = function () {
			function t(t, i) {
				var r, o = this;
				o.defaults = {
					accessibility: !0,
					adaptiveHeight: !1,
					appendArrows: e(t),
					appendDots: e(t),
					arrows: !0,
					asNavFor: null,
					prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
					nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
					autoplay: !1,
					autoplaySpeed: 3e3,
					centerMode: !1,
					centerPadding: "50px",
					cssEase: "ease",
					customPaging: function (t, n) {
						return e('<button type="button" />').text(n + 1)
					},
					dots: !1,
					dotsClass: "slick-dots",
					draggable: !0,
					easing: "linear",
					edgeFriction: .35,
					fade: !1,
					focusOnSelect: !1,
					focusOnChange: !1,
					infinite: !0,
					initialSlide: 0,
					lazyLoad: "ondemand",
					mobileFirst: !1,
					pauseOnHover: !0,
					pauseOnFocus: !0,
					pauseOnDotsHover: !1,
					respondTo: "window",
					responsive: null,
					rows: 1,
					rtl: !1,
					slide: "",
					slidesPerRow: 1,
					slidesToShow: 1,
					slidesToScroll: 1,
					speed: 500,
					swipe: !0,
					swipeToSlide: !1,
					touchMove: !0,
					touchThreshold: 5,
					useCSS: !0,
					useTransform: !0,
					variableWidth: !1,
					vertical: !1,
					verticalSwiping: !1,
					waitForAnimate: !0,
					zIndex: 1e3
				}, o.initials = {
					animating: !1,
					dragging: !1,
					autoPlayTimer: null,
					currentDirection: 0,
					currentLeft: null,
					currentSlide: 0,
					direction: 1,
					$dots: null,
					listWidth: null,
					listHeight: null,
					loadIndex: 0,
					$nextArrow: null,
					$prevArrow: null,
					scrolling: !1,
					slideCount: null,
					slideWidth: null,
					$slideTrack: null,
					$slides: null,
					sliding: !1,
					slideOffset: 0,
					swipeLeft: null,
					swiping: !1,
					$list: null,
					touchObject: {},
					transformsEnabled: !1,
					unslicked: !1
				}, e.extend(o, o.initials), o.activeBreakpoint = null, o.animType = null, o.animProp = null, o.breakpoints = [], o.breakpointSettings = [], o.cssTransitions = !1, o.focussed = !1, o.interrupted = !1, o.hidden = "hidden", o.paused = !0, o.positionProp = null, o.respondTo = null, o.rowCount = 1, o.shouldClick = !0, o.$slider = e(t), o.$slidesCache = null, o.transformType = null, o.transitionType = null, o.visibilityChange = "visibilitychange", o.windowWidth = 0, o.windowTimer = null, r = e(t).data("slick") || {}, o.options = e.extend({}, o.defaults, i, r), o.currentSlide = o.options.initialSlide, o.originalSettings = o.options, "undefined" != typeof document.mozHidden ? (o.hidden = "mozHidden", o.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (o.hidden = "webkitHidden", o.visibilityChange = "webkitvisibilitychange"), o.autoPlay = e.proxy(o.autoPlay, o), o.autoPlayClear = e.proxy(o.autoPlayClear, o), o.autoPlayIterator = e.proxy(o.autoPlayIterator, o), o.changeSlide = e.proxy(o.changeSlide, o), o.clickHandler = e.proxy(o.clickHandler, o), o.selectHandler = e.proxy(o.selectHandler, o), o.setPosition = e.proxy(o.setPosition, o), o.swipeHandler = e.proxy(o.swipeHandler, o), o.dragHandler = e.proxy(o.dragHandler, o), o.keyHandler = e.proxy(o.keyHandler, o), o.instanceUid = n++, o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, o.registerBreakpoints(), o.init(!0)
			}
			var n = 0;
			return t
		}()).prototype.activateADA = function () {
			this.$slideTrack.find(".slick-active").attr({
				"aria-hidden": "false"
			}).find("a, input, button, select").attr({
				tabindex: "0"
			})
		}, t.prototype.addSlide = t.prototype.slickAdd = function (t, n, i) {
			var r = this;
			if ("boolean" == typeof n) i = n, n = null;
			else if (n < 0 || n >= r.slideCount) return !1;
			r.unload(), "number" == typeof n ? 0 === n && 0 === r.$slides.length ? e(t).appendTo(r.$slideTrack) : i ? e(t).insertBefore(r.$slides.eq(n)) : e(t).insertAfter(r.$slides.eq(n)) : !0 === i ? e(t).prependTo(r.$slideTrack) : e(t).appendTo(r.$slideTrack), r.$slides = r.$slideTrack.children(this.options.slide), r.$slideTrack.children(this.options.slide).detach(), r.$slideTrack.append(r.$slides), r.$slides.each(function (t, n) {
				e(n).attr("data-slick-index", t)
			}), r.$slidesCache = r.$slides, r.reinit()
		}, t.prototype.animateHeight = function () {
			var e = this;
			if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
				var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
				e.$list.animate({
					height: t
				}, e.options.speed)
			}
		}, t.prototype.animateSlide = function (t, n) {
			var i = {},
				r = this;
			r.animateHeight(), !0 === r.options.rtl && !1 === r.options.vertical && (t = -t), !1 === r.transformsEnabled ? !1 === r.options.vertical ? r.$slideTrack.animate({
				left: t
			}, r.options.speed, r.options.easing, n) : r.$slideTrack.animate({
				top: t
			}, r.options.speed, r.options.easing, n) : !1 === r.cssTransitions ? (!0 === r.options.rtl && (r.currentLeft = -r.currentLeft), e({
				animStart: r.currentLeft
			}).animate({
				animStart: t
			}, {
				duration: r.options.speed,
				easing: r.options.easing,
				step: function (e) {
					e = Math.ceil(e), !1 === r.options.vertical ? (i[r.animType] = "translate(" + e + "px, 0px)", r.$slideTrack.css(i)) : (i[r.animType] = "translate(0px," + e + "px)", r.$slideTrack.css(i))
				},
				complete: function () {
					n && n.call()
				}
			})) : (r.applyTransition(), t = Math.ceil(t), !1 === r.options.vertical ? i[r.animType] = "translate3d(" + t + "px, 0px, 0px)" : i[r.animType] = "translate3d(0px," + t + "px, 0px)", r.$slideTrack.css(i), n && setTimeout(function () {
				r.disableTransition(), n.call()
			}, r.options.speed))
		}, t.prototype.getNavTarget = function () {
			var t = this,
				n = t.options.asNavFor;
			return n && null !== n && (n = e(n).not(t.$slider)), n
		}, t.prototype.asNavFor = function (t) {
			var n = this.getNavTarget();
			null !== n && "object" == typeof n && n.each(function () {
				var n = e(this).slick("getSlick");
				n.unslicked || n.slideHandler(t, !0)
			})
		}, t.prototype.applyTransition = function (e) {
			var t = this,
				n = {};
			!1 === t.options.fade ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
		}, t.prototype.autoPlay = function () {
			var e = this;
			e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
		}, t.prototype.autoPlayClear = function () {
			var e = this;
			e.autoPlayTimer && clearInterval(e.autoPlayTimer)
		}, t.prototype.autoPlayIterator = function () {
			var e = this,
				t = e.currentSlide + e.options.slidesToScroll;
			e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
		}, t.prototype.buildArrows = function () {
			var t = this;
			!0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
				"aria-disabled": "true",
				tabindex: "-1"
			}))
		}, t.prototype.buildDots = function () {
			var t, n, i = this;
			if (!0 === i.options.dots && i.slideCount > i.options.slidesToShow) {
				for (i.$slider.addClass("slick-dotted"), n = e("<ul />").addClass(i.options.dotsClass), t = 0; t <= i.getDotCount(); t += 1) n.append(e("<li />").append(i.options.customPaging.call(this, i, t)));
				i.$dots = n.appendTo(i.options.appendDots), i.$dots.find("li").first().addClass("slick-active")
			}
		}, t.prototype.buildOut = function () {
			var t = this;
			t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each(function (t, n) {
				e(n).attr("data-slick-index", t).data("originalStyling", e(n).attr("style") || "")
			}), t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(), t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(), t.$slideTrack.css("opacity", 0), !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), !0 === t.options.draggable && t.$list.addClass("draggable")
		}, t.prototype.buildRows = function () {
			var e, t, n, i, r, o, s, a = this;
			if (i = document.createDocumentFragment(), o = a.$slider.children(), a.options.rows > 0) {
				for (s = a.options.slidesPerRow * a.options.rows, r = Math.ceil(o.length / s), e = 0; e < r; e++) {
					var c = document.createElement("div");
					for (t = 0; t < a.options.rows; t++) {
						var l = document.createElement("div");
						for (n = 0; n < a.options.slidesPerRow; n++) {
							var d = e * s + (t * a.options.slidesPerRow + n);
							o.get(d) && l.appendChild(o.get(d))
						}
						c.appendChild(l)
					}
					i.appendChild(c)
				}
				a.$slider.empty().append(i), a.$slider.children().children().children().css({
					width: 100 / a.options.slidesPerRow + "%",
					display: "inline-block"
				})
			}
		}, t.prototype.checkResponsive = function (t, n) {
			var i, r, o, s = this,
				a = !1,
				c = s.$slider.width(),
				l = window.innerWidth || e(window).width();
			if ("window" === s.respondTo ? o = l : "slider" === s.respondTo ? o = c : "min" === s.respondTo && (o = Math.min(l, c)), s.options.responsive && s.options.responsive.length && null !== s.options.responsive) {
				for (i in r = null, s.breakpoints) s.breakpoints.hasOwnProperty(i) && (!1 === s.originalSettings.mobileFirst ? o < s.breakpoints[i] && (r = s.breakpoints[i]) : o > s.breakpoints[i] && (r = s.breakpoints[i]));
				null !== r ? null !== s.activeBreakpoint ? (r !== s.activeBreakpoint || n) && (s.activeBreakpoint = r, "unslick" === s.breakpointSettings[r] ? s.unslick(r) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[r]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = r) : (s.activeBreakpoint = r, "unslick" === s.breakpointSettings[r] ? s.unslick(r) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[r]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = r) : null !== s.activeBreakpoint && (s.activeBreakpoint = null, s.options = s.originalSettings, !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t), a = r), t || !1 === a || s.$slider.trigger("breakpoint", [s, a])
			}
		}, t.prototype.changeSlide = function (t, n) {
			var i, r, o = this,
				s = e(t.currentTarget);
			switch (s.is("a") && t.preventDefault(), s.is("li") || (s = s.closest("li")), i = o.slideCount % o.options.slidesToScroll != 0 ? 0 : (o.slideCount - o.currentSlide) % o.options.slidesToScroll, t.data.message) {
				case "previous":
					r = 0 === i ? o.options.slidesToScroll : o.options.slidesToShow - i, o.slideCount > o.options.slidesToShow && o.slideHandler(o.currentSlide - r, !1, n);
					break;
				case "next":
					r = 0 === i ? o.options.slidesToScroll : i, o.slideCount > o.options.slidesToShow && o.slideHandler(o.currentSlide + r, !1, n);
					break;
				case "index":
					var a = 0 === t.data.index ? 0 : t.data.index || s.index() * o.options.slidesToScroll;
					o.slideHandler(o.checkNavigable(a), !1, n), s.children().trigger("focus");
					break;
				default:
					return
			}
		}, t.prototype.checkNavigable = function (e) {
			var t, n;
			if (n = 0, e > (t = this.getNavigableIndexes())[t.length - 1]) e = t[t.length - 1];
			else
				for (var i in t) {
					if (e < t[i]) {
						e = n;
						break
					}
					n = t[i]
				}
			return e
		}, t.prototype.cleanUpEvents = function () {
			var t = this;
			t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)), !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)), t.$slider.off("focus.slick blur.slick"), !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide), !0 === t.options.accessibility && (t.$prevArrow && t.$prevArrow.off("keydown.slick", t.keyHandler), t.$nextArrow && t.$nextArrow.off("keydown.slick", t.keyHandler))), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document).off(t.visibilityChange, t.visibility), t.cleanUpSlideEvents(), !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler), e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window).off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault), e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
		}, t.prototype.cleanUpSlideEvents = function () {
			var t = this;
			t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
		}, t.prototype.cleanUpRows = function () {
			var e, t = this;
			t.options.rows > 0 && ((e = t.$slides.children().children()).removeAttr("style"), t.$slider.empty().append(e))
		}, t.prototype.clickHandler = function (e) {
			!1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
		}, t.prototype.destroy = function (t) {
			var n = this;
			n.autoPlayClear(), n.touchObject = {}, n.cleanUpEvents(), e(".slick-cloned", n.$slider).detach(), n.$dots && n.$dots.remove(), n.$prevArrow && n.$prevArrow.length && (n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.prevArrow) && n.$prevArrow.remove()), n.$nextArrow && n.$nextArrow.length && (n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.nextArrow) && n.$nextArrow.remove()), n.$slides && (n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
				e(this).attr("style", e(this).data("originalStyling"))
			}), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.detach(), n.$list.detach(), n.$slider.append(n.$slides)), n.cleanUpRows(), n.$slider.removeClass("slick-slider"), n.$slider.removeClass("slick-initialized"), n.$slider.removeClass("slick-dotted"), n.unslicked = !0, t || n.$slider.trigger("destroy", [n])
		}, t.prototype.disableTransition = function (e) {
			var t = this,
				n = {};
			n[t.transitionType] = "", !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
		}, t.prototype.fadeSlide = function (e, t) {
			var n = this;
			!1 === n.cssTransitions ? (n.$slides.eq(e).css({
				zIndex: n.options.zIndex
			}), n.$slides.eq(e).animate({
				opacity: 1
			}, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e).css({
				opacity: 1,
				zIndex: n.options.zIndex
			}), t && setTimeout(function () {
				n.disableTransition(e), t.call()
			}, n.options.speed))
		}, t.prototype.fadeSlideOut = function (e) {
			var t = this;
			!1 === t.cssTransitions ? t.$slides.eq(e).animate({
				opacity: 0,
				zIndex: t.options.zIndex - 2
			}, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
				opacity: 0,
				zIndex: t.options.zIndex - 2
			}))
		}, t.prototype.filterSlides = t.prototype.slickFilter = function (e) {
			var t = this;
			null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
		}, t.prototype.focusHandler = function () {
			var t = this;
			t.$slider.off("focus.slick blur.slick").on("focus.slick", "*", function () {
				var n = e(this);
				setTimeout(function () {
					t.options.pauseOnFocus && n.is(":focus") && (t.focussed = !0, t.autoPlay())
				}, 0)
			}).on("blur.slick", "*", function () {
				e(this);
				t.options.pauseOnFocus && (t.focussed = !1, t.autoPlay())
			})
		}, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function () {
			return this.currentSlide
		}, t.prototype.getDotCount = function () {
			var e = this,
				t = 0,
				n = 0,
				i = 0;
			if (!0 === e.options.infinite)
				if (e.slideCount <= e.options.slidesToShow) ++i;
				else
					for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
			else if (!0 === e.options.centerMode) i = e.slideCount;
			else if (e.options.asNavFor)
				for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
			else i = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
			return i - 1
		}, t.prototype.getLeft = function (e) {
			var t, n, i, r, o = this,
				s = 0;
			return o.slideOffset = 0, n = o.$slides.first().outerHeight(!0), !0 === o.options.infinite ? (o.slideCount > o.options.slidesToShow && (o.slideOffset = o.slideWidth * o.options.slidesToShow * -1, r = -1, !0 === o.options.vertical && !0 === o.options.centerMode && (2 === o.options.slidesToShow ? r = -1.5 : 1 === o.options.slidesToShow && (r = -2)), s = n * o.options.slidesToShow * r), o.slideCount % o.options.slidesToScroll != 0 && e + o.options.slidesToScroll > o.slideCount && o.slideCount > o.options.slidesToShow && (e > o.slideCount ? (o.slideOffset = (o.options.slidesToShow - (e - o.slideCount)) * o.slideWidth * -1, s = (o.options.slidesToShow - (e - o.slideCount)) * n * -1) : (o.slideOffset = o.slideCount % o.options.slidesToScroll * o.slideWidth * -1, s = o.slideCount % o.options.slidesToScroll * n * -1))) : e + o.options.slidesToShow > o.slideCount && (o.slideOffset = (e + o.options.slidesToShow - o.slideCount) * o.slideWidth, s = (e + o.options.slidesToShow - o.slideCount) * n), o.slideCount <= o.options.slidesToShow && (o.slideOffset = 0, s = 0), !0 === o.options.centerMode && o.slideCount <= o.options.slidesToShow ? o.slideOffset = o.slideWidth * Math.floor(o.options.slidesToShow) / 2 - o.slideWidth * o.slideCount / 2 : !0 === o.options.centerMode && !0 === o.options.infinite ? o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2) - o.slideWidth : !0 === o.options.centerMode && (o.slideOffset = 0, o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2)), t = !1 === o.options.vertical ? e * o.slideWidth * -1 + o.slideOffset : e * n * -1 + s, !0 === o.options.variableWidth && (i = o.slideCount <= o.options.slidesToShow || !1 === o.options.infinite ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow), t = !0 === o.options.rtl ? i[0] ? -1 * (o.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, !0 === o.options.centerMode && (i = o.slideCount <= o.options.slidesToShow || !1 === o.options.infinite ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow + 1), t = !0 === o.options.rtl ? i[0] ? -1 * (o.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, t += (o.$list.width() - i.outerWidth()) / 2)), t
		}, t.prototype.getOption = t.prototype.slickGetOption = function (e) {
			return this.options[e]
		}, t.prototype.getNavigableIndexes = function () {
			var e, t = this,
				n = 0,
				i = 0,
				r = [];
			for (!1 === t.options.infinite ? e = t.slideCount : (n = -1 * t.options.slidesToScroll, i = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); n < e;) r.push(n), n = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
			return r
		}, t.prototype.getSlick = function () {
			return this
		}, t.prototype.getSlideCount = function () {
			var t, n, i, r = this;
			return i = !0 === r.options.centerMode ? Math.floor(r.$list.width() / 2) : 0, n = -1 * r.swipeLeft + i, !0 === r.options.swipeToSlide ? (r.$slideTrack.find(".slick-slide").each(function (i, o) {
				var s, a;
				if (s = e(o).outerWidth(), a = o.offsetLeft, !0 !== r.options.centerMode && (a += s / 2), n < a + s) return t = o, !1
			}), Math.abs(e(t).attr("data-slick-index") - r.currentSlide) || 1) : r.options.slidesToScroll
		}, t.prototype.goTo = t.prototype.slickGoTo = function (e, t) {
			this.changeSlide({
				data: {
					message: "index",
					index: parseInt(e)
				}
			}, t)
		}, t.prototype.init = function (t) {
			var n = this;
			e(n.$slider).hasClass("slick-initialized") || (e(n.$slider).addClass("slick-initialized"), n.buildRows(), n.buildOut(), n.setProps(), n.startLoad(), n.loadSlider(), n.initializeEvents(), n.updateArrows(), n.updateDots(), n.checkResponsive(!0), n.focusHandler()), t && n.$slider.trigger("init", [n]), !0 === n.options.accessibility && n.initADA(), n.options.autoplay && (n.paused = !1, n.autoPlay())
		}, t.prototype.initADA = function () {
			var t = this,
				n = Math.ceil(t.slideCount / t.options.slidesToShow),
				i = t.getNavigableIndexes().filter(function (e) {
					return e >= 0 && e < t.slideCount
				});
			t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
				"aria-hidden": "true",
				tabindex: "-1"
			}).find("a, input, button, select").attr({
				tabindex: "-1"
			}), null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function (n) {
				var r = i.indexOf(n);
				if (e(this).attr({
						role: "tabpanel",
						id: "slick-slide" + t.instanceUid + n,
						tabindex: -1
					}), -1 !== r) {
					var o = "slick-slide-control" + t.instanceUid + r;
					e("#" + o).length && e(this).attr({
						"aria-describedby": o
					})
				}
			}), t.$dots.attr("role", "tablist").find("li").each(function (r) {
				var o = i[r];
				e(this).attr({
					role: "presentation"
				}), e(this).find("button").first().attr({
					role: "tab",
					id: "slick-slide-control" + t.instanceUid + r,
					"aria-controls": "slick-slide" + t.instanceUid + o,
					"aria-label": r + 1 + " of " + n,
					"aria-selected": null,
					tabindex: "-1"
				})
			}).eq(t.currentSlide).find("button").attr({
				"aria-selected": "true",
				tabindex: "0"
			}).end());
			for (var r = t.currentSlide, o = r + t.options.slidesToShow; r < o; r++) t.options.focusOnChange ? t.$slides.eq(r).attr({
				tabindex: "0"
			}) : t.$slides.eq(r).removeAttr("tabindex");
			t.activateADA()
		}, t.prototype.initArrowEvents = function () {
			var e = this;
			!0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
				message: "previous"
			}, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
				message: "next"
			}, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
		}, t.prototype.initDotEvents = function () {
			var t = this;
			!0 === t.options.dots && t.slideCount > t.options.slidesToShow && (e("li", t.$dots).on("click.slick", {
				message: "index"
			}, t.changeSlide), !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)), !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && t.slideCount > t.options.slidesToShow && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
		}, t.prototype.initSlideEvents = function () {
			var t = this;
			t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
		}, t.prototype.initializeEvents = function () {
			var t = this;
			t.initArrowEvents(), t.initDotEvents(), t.initSlideEvents(), t.$list.on("touchstart.slick mousedown.slick", {
				action: "start"
			}, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
				action: "move"
			}, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
				action: "end"
			}, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
				action: "end"
			}, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document).on(t.visibilityChange, e.proxy(t.visibility, t)), !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault), e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition), e(t.setPosition)
		}, t.prototype.initUI = function () {
			var e = this;
			!0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
		}, t.prototype.keyHandler = function (e) {
			var t = this;
			e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
				data: {
					message: !0 === t.options.rtl ? "next" : "previous"
				}
			}) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
				data: {
					message: !0 === t.options.rtl ? "previous" : "next"
				}
			}))
		}, t.prototype.lazyLoad = function () {
			function t(t) {
				e("img[data-lazy]", t).each(function () {
					var t = e(this),
						n = e(this).attr("data-lazy"),
						i = e(this).attr("data-srcset"),
						r = e(this).attr("data-sizes") || o.$slider.attr("data-sizes"),
						s = document.createElement("img");
					s.onload = function () {
						t.animate({
							opacity: 0
						}, 100, function () {
							i && (t.attr("srcset", i), r && t.attr("sizes", r)), t.attr("src", n).animate({
								opacity: 1
							}, 200, function () {
								t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
							}), o.$slider.trigger("lazyLoaded", [o, t, n])
						})
					}, s.onerror = function () {
						t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), o.$slider.trigger("lazyLoadError", [o, t, n])
					}, s.src = n
				})
			}
			var n, i, r, o = this;
			if (!0 === o.options.centerMode ? !0 === o.options.infinite ? r = (i = o.currentSlide + (o.options.slidesToShow / 2 + 1)) + o.options.slidesToShow + 2 : (i = Math.max(0, o.currentSlide - (o.options.slidesToShow / 2 + 1)), r = o.options.slidesToShow / 2 + 1 + 2 + o.currentSlide) : (i = o.options.infinite ? o.options.slidesToShow + o.currentSlide : o.currentSlide, r = Math.ceil(i + o.options.slidesToShow), !0 === o.options.fade && (i > 0 && i--, r <= o.slideCount && r++)), n = o.$slider.find(".slick-slide").slice(i, r), "anticipated" === o.options.lazyLoad)
				for (var s = i - 1, a = r, c = o.$slider.find(".slick-slide"), l = 0; l < o.options.slidesToScroll; l++) s < 0 && (s = o.slideCount - 1), n = (n = n.add(c.eq(s))).add(c.eq(a)), s--, a++;
			t(n), o.slideCount <= o.options.slidesToShow ? t(o.$slider.find(".slick-slide")) : o.currentSlide >= o.slideCount - o.options.slidesToShow ? t(o.$slider.find(".slick-cloned").slice(0, o.options.slidesToShow)) : 0 === o.currentSlide && t(o.$slider.find(".slick-cloned").slice(-1 * o.options.slidesToShow))
		}, t.prototype.loadSlider = function () {
			var e = this;
			e.setPosition(), e.$slideTrack.css({
				opacity: 1
			}), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
		}, t.prototype.next = t.prototype.slickNext = function () {
			this.changeSlide({
				data: {
					message: "next"
				}
			})
		}, t.prototype.orientationChange = function () {
			var e = this;
			e.checkResponsive(), e.setPosition()
		}, t.prototype.pause = t.prototype.slickPause = function () {
			var e = this;
			e.autoPlayClear(), e.paused = !0
		}, t.prototype.play = t.prototype.slickPlay = function () {
			var e = this;
			e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
		}, t.prototype.postSlide = function (t) {
			var n = this;
			n.unslicked || (n.$slider.trigger("afterChange", [n, t]), n.animating = !1, n.slideCount > n.options.slidesToShow && n.setPosition(), n.swipeLeft = null, n.options.autoplay && n.autoPlay(), !0 === n.options.accessibility && (n.initADA(), n.options.focusOnChange && e(n.$slides.get(n.currentSlide)).attr("tabindex", 0).focus()))
		}, t.prototype.prev = t.prototype.slickPrev = function () {
			this.changeSlide({
				data: {
					message: "previous"
				}
			})
		}, t.prototype.preventDefault = function (e) {
			e.preventDefault()
		}, t.prototype.progressiveLazyLoad = function (t) {
			t = t || 1;
			var n, i, r, o, s, a = this,
				c = e("img[data-lazy]", a.$slider);
			c.length ? (n = c.first(), i = n.attr("data-lazy"), r = n.attr("data-srcset"), o = n.attr("data-sizes") || a.$slider.attr("data-sizes"), (s = document.createElement("img")).onload = function () {
				r && (n.attr("srcset", r), o && n.attr("sizes", o)), n.attr("src", i).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === a.options.adaptiveHeight && a.setPosition(), a.$slider.trigger("lazyLoaded", [a, n, i]), a.progressiveLazyLoad()
			}, s.onerror = function () {
				t < 3 ? setTimeout(function () {
					a.progressiveLazyLoad(t + 1)
				}, 500) : (n.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, n, i]), a.progressiveLazyLoad())
			}, s.src = i) : a.$slider.trigger("allImagesLoaded", [a])
		}, t.prototype.refresh = function (t) {
			var n, i, r = this;
			i = r.slideCount - r.options.slidesToShow, !r.options.infinite && r.currentSlide > i && (r.currentSlide = i), r.slideCount <= r.options.slidesToShow && (r.currentSlide = 0), n = r.currentSlide, r.destroy(!0), e.extend(r, r.initials, {
				currentSlide: n
			}), r.init(), t || r.changeSlide({
				data: {
					message: "index",
					index: n
				}
			}, !1)
		}, t.prototype.registerBreakpoints = function () {
			var t, n, i, r = this,
				o = r.options.responsive || null;
			if ("array" === e.type(o) && o.length) {
				for (t in r.respondTo = r.options.respondTo || "window", o)
					if (i = r.breakpoints.length - 1, o.hasOwnProperty(t)) {
						for (n = o[t].breakpoint; i >= 0;) r.breakpoints[i] && r.breakpoints[i] === n && r.breakpoints.splice(i, 1), i--;
						r.breakpoints.push(n), r.breakpointSettings[n] = o[t].settings
					} r.breakpoints.sort(function (e, t) {
					return r.options.mobileFirst ? e - t : t - e
				})
			}
		}, t.prototype.reinit = function () {
			var t = this;
			t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.cleanUpSlideEvents(), t.initSlideEvents(), t.checkResponsive(!1, !0), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.setPosition(), t.focusHandler(), t.paused = !t.options.autoplay, t.autoPlay(), t.$slider.trigger("reInit", [t])
		}, t.prototype.resize = function () {
			var t = this;
			e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout(function () {
				t.windowWidth = e(window).width(), t.checkResponsive(), t.unslicked || t.setPosition()
			}, 50))
		}, t.prototype.removeSlide = t.prototype.slickRemove = function (e, t, n) {
			var i = this;
			if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : i.slideCount - 1 : !0 === t ? --e : e, i.slideCount < 1 || e < 0 || e > i.slideCount - 1) return !1;
			i.unload(), !0 === n ? i.$slideTrack.children().remove() : i.$slideTrack.children(this.options.slide).eq(e).remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, i.reinit()
		}, t.prototype.setCSS = function (e) {
			var t, n, i = this,
				r = {};
			!0 === i.options.rtl && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", r[i.positionProp] = e, !1 === i.transformsEnabled ? i.$slideTrack.css(r) : (r = {}, !1 === i.cssTransitions ? (r[i.animType] = "translate(" + t + ", " + n + ")", i.$slideTrack.css(r)) : (r[i.animType] = "translate3d(" + t + ", " + n + ", 0px)", i.$slideTrack.css(r)))
		}, t.prototype.setDimensions = function () {
			var e = this;
			!1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
				padding: "0px " + e.options.centerPadding
			}) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
				padding: e.options.centerPadding + " 0px"
			})), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
			var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
			!1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
		}, t.prototype.setFade = function () {
			var t, n = this;
			n.$slides.each(function (i, r) {
				t = n.slideWidth * i * -1, !0 === n.options.rtl ? e(r).css({
					position: "relative",
					right: t,
					top: 0,
					zIndex: n.options.zIndex - 2,
					opacity: 0
				}) : e(r).css({
					position: "relative",
					left: t,
					top: 0,
					zIndex: n.options.zIndex - 2,
					opacity: 0
				})
			}), n.$slides.eq(n.currentSlide).css({
				zIndex: n.options.zIndex - 1,
				opacity: 1
			})
		}, t.prototype.setHeight = function () {
			var e = this;
			if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
				var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
				e.$list.css("height", t)
			}
		}, t.prototype.setOption = t.prototype.slickSetOption = function () {
			var t, n, i, r, o, s = this,
				a = !1;
			if ("object" === e.type(arguments[0]) ? (i = arguments[0], a = arguments[1], o = "multiple") : "string" === e.type(arguments[0]) && (i = arguments[0], r = arguments[1], a = arguments[2], "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? o = "responsive" : "undefined" != typeof arguments[1] && (o = "single")), "single" === o) s.options[i] = r;
			else if ("multiple" === o) e.each(i, function (e, t) {
				s.options[e] = t
			});
			else if ("responsive" === o)
				for (n in r)
					if ("array" !== e.type(s.options.responsive)) s.options.responsive = [r[n]];
					else {
						for (t = s.options.responsive.length - 1; t >= 0;) s.options.responsive[t].breakpoint === r[n].breakpoint && s.options.responsive.splice(t, 1), t--;
						s.options.responsive.push(r[n])
					} a && (s.unload(), s.reinit())
		}, t.prototype.setPosition = function () {
			var e = this;
			e.setDimensions(), e.setHeight(), !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
		}, t.prototype.setProps = function () {
			var e = this,
				t = document.body.style;
			e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), t.WebkitTransition === undefined && t.MozTransition === undefined && t.msTransition === undefined || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), t.OTransform !== undefined && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", t.perspectiveProperty === undefined && t.webkitPerspective === undefined && (e.animType = !1)), t.MozTransform !== undefined && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", t.perspectiveProperty === undefined && t.MozPerspective === undefined && (e.animType = !1)), t.webkitTransform !== undefined && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", t.perspectiveProperty === undefined && t.webkitPerspective === undefined && (e.animType = !1)), t.msTransform !== undefined && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", t.msTransform === undefined && (e.animType = !1)), t.transform !== undefined && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
		}, t.prototype.setSlideClasses = function (e) {
			var t, n, i, r, o = this;
			if (n = o.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), o.$slides.eq(e).addClass("slick-current"), !0 === o.options.centerMode) {
				var s = o.options.slidesToShow % 2 == 0 ? 1 : 0;
				t = Math.floor(o.options.slidesToShow / 2), !0 === o.options.infinite && (e >= t && e <= o.slideCount - 1 - t ? o.$slides.slice(e - t + s, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (i = o.options.slidesToShow + e, n.slice(i - t + 1 + s, i + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? n.eq(o.options.slidesToShow + o.slideCount + 1).addClass("slick-center") : e === o.slideCount - 1 && n.eq(o.options.slidesToShow).addClass("slick-center")), o.$slides.eq(e).addClass("slick-center")
			} else e >= 0 && e <= o.slideCount - o.options.slidesToShow ? o.$slides.slice(e, e + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : n.length <= o.options.slidesToShow ? n.addClass("slick-active").attr("aria-hidden", "false") : (r = o.slideCount % o.options.slidesToShow, i = !0 === o.options.infinite ? o.options.slidesToShow + e : e, o.options.slidesToShow == o.options.slidesToScroll && o.slideCount - e < o.options.slidesToShow ? n.slice(i - (o.options.slidesToShow - r), i + r).addClass("slick-active").attr("aria-hidden", "false") : n.slice(i, i + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
			"ondemand" !== o.options.lazyLoad && "anticipated" !== o.options.lazyLoad || o.lazyLoad()
		}, t.prototype.setupInfinite = function () {
			var t, n, i, r = this;
			if (!0 === r.options.fade && (r.options.centerMode = !1), !0 === r.options.infinite && !1 === r.options.fade && (n = null, r.slideCount > r.options.slidesToShow)) {
				for (i = !0 === r.options.centerMode ? r.options.slidesToShow + 1 : r.options.slidesToShow, t = r.slideCount; t > r.slideCount - i; t -= 1) n = t - 1, e(r.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n - r.slideCount).prependTo(r.$slideTrack).addClass("slick-cloned");
				for (t = 0; t < i + r.slideCount; t += 1) n = t, e(r.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n + r.slideCount).appendTo(r.$slideTrack).addClass("slick-cloned");
				r.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
					e(this).attr("id", "")
				})
			}
		}, t.prototype.interrupt = function (e) {
			var t = this;
			e || t.autoPlay(), t.interrupted = e
		}, t.prototype.selectHandler = function (t) {
			var n = this,
				i = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
				r = parseInt(i.attr("data-slick-index"));
			r || (r = 0), n.slideCount <= n.options.slidesToShow ? n.slideHandler(r, !1, !0) : n.slideHandler(r)
		}, t.prototype.slideHandler = function (e, t, n) {
			var i, r, o, s, a, c = null,
				l = this;
			if (t = t || !1, !(!0 === l.animating && !0 === l.options.waitForAnimate || !0 === l.options.fade && l.currentSlide === e))
				if (!1 === t && l.asNavFor(e), i = e, c = l.getLeft(i), s = l.getLeft(l.currentSlide), l.currentLeft = null === l.swipeLeft ? s : l.swipeLeft, !1 === l.options.infinite && !1 === l.options.centerMode && (e < 0 || e > l.getDotCount() * l.options.slidesToScroll)) !1 === l.options.fade && (i = l.currentSlide, !0 !== n && l.slideCount > l.options.slidesToShow ? l.animateSlide(s, function () {
					l.postSlide(i)
				}) : l.postSlide(i));
				else if (!1 === l.options.infinite && !0 === l.options.centerMode && (e < 0 || e > l.slideCount - l.options.slidesToScroll)) !1 === l.options.fade && (i = l.currentSlide, !0 !== n && l.slideCount > l.options.slidesToShow ? l.animateSlide(s, function () {
				l.postSlide(i)
			}) : l.postSlide(i));
			else {
				if (l.options.autoplay && clearInterval(l.autoPlayTimer), r = i < 0 ? l.slideCount % l.options.slidesToScroll != 0 ? l.slideCount - l.slideCount % l.options.slidesToScroll : l.slideCount + i : i >= l.slideCount ? l.slideCount % l.options.slidesToScroll != 0 ? 0 : i - l.slideCount : i, l.animating = !0, l.$slider.trigger("beforeChange", [l, l.currentSlide, r]), o = l.currentSlide, l.currentSlide = r, l.setSlideClasses(l.currentSlide), l.options.asNavFor && (a = (a = l.getNavTarget()).slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(l.currentSlide), l.updateDots(), l.updateArrows(), !0 === l.options.fade) return !0 !== n ? (l.fadeSlideOut(o), l.fadeSlide(r, function () {
					l.postSlide(r)
				})) : l.postSlide(r), void l.animateHeight();
				!0 !== n && l.slideCount > l.options.slidesToShow ? l.animateSlide(c, function () {
					l.postSlide(r)
				}) : l.postSlide(r)
			}
		}, t.prototype.startLoad = function () {
			var e = this;
			!0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
		}, t.prototype.swipeDirection = function () {
			var e, t, n, i, r = this;
			return e = r.touchObject.startX - r.touchObject.curX, t = r.touchObject.startY - r.touchObject.curY, n = Math.atan2(t, e), (i = Math.round(180 * n / Math.PI)) < 0 && (i = 360 - Math.abs(i)), i <= 45 && i >= 0 ? !1 === r.options.rtl ? "left" : "right" : i <= 360 && i >= 315 ? !1 === r.options.rtl ? "left" : "right" : i >= 135 && i <= 225 ? !1 === r.options.rtl ? "right" : "left" : !0 === r.options.verticalSwiping ? i >= 35 && i <= 135 ? "down" : "up" : "vertical"
		}, t.prototype.swipeEnd = function () {
			var e, t, n = this;
			if (n.dragging = !1, n.swiping = !1, n.scrolling) return n.scrolling = !1, !1;
			if (n.interrupted = !1, n.shouldClick = !(n.touchObject.swipeLength > 10), n.touchObject.curX === undefined) return !1;
			if (!0 === n.touchObject.edgeHit && n.$slider.trigger("edge", [n, n.swipeDirection()]), n.touchObject.swipeLength >= n.touchObject.minSwipe) {
				switch (t = n.swipeDirection()) {
					case "left":
					case "down":
						e = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide + n.getSlideCount()) : n.currentSlide + n.getSlideCount(), n.currentDirection = 0;
						break;
					case "right":
					case "up":
						e = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide - n.getSlideCount()) : n.currentSlide - n.getSlideCount(), n.currentDirection = 1
				}
				"vertical" != t && (n.slideHandler(e), n.touchObject = {}, n.$slider.trigger("swipe", [n, t]))
			} else n.touchObject.startX !== n.touchObject.curX && (n.slideHandler(n.currentSlide), n.touchObject = {})
		}, t.prototype.swipeHandler = function (e) {
			var t = this;
			if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && e.originalEvent.touches !== undefined ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
				case "start":
					t.swipeStart(e);
					break;
				case "move":
					t.swipeMove(e);
					break;
				case "end":
					t.swipeEnd(e)
			}
		}, t.prototype.swipeMove = function (e) {
			var t, n, i, r, o, s, a = this;
			return o = e.originalEvent !== undefined ? e.originalEvent.touches : null, !(!a.dragging || a.scrolling || o && 1 !== o.length) && (t = a.getLeft(a.currentSlide), a.touchObject.curX = o !== undefined ? o[0].pageX : e.clientX, a.touchObject.curY = o !== undefined ? o[0].pageY : e.clientY, a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))), s = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))), !a.options.verticalSwiping && !a.swiping && s > 4 ? (a.scrolling = !0, !1) : (!0 === a.options.verticalSwiping && (a.touchObject.swipeLength = s), n = a.swipeDirection(), e.originalEvent !== undefined && a.touchObject.swipeLength > 4 && (a.swiping = !0, e.preventDefault()), r = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), !0 === a.options.verticalSwiping && (r = a.touchObject.curY > a.touchObject.startY ? 1 : -1), i = a.touchObject.swipeLength, a.touchObject.edgeHit = !1, !1 === a.options.infinite && (0 === a.currentSlide && "right" === n || a.currentSlide >= a.getDotCount() && "left" === n) && (i = a.touchObject.swipeLength * a.options.edgeFriction, a.touchObject.edgeHit = !0), !1 === a.options.vertical ? a.swipeLeft = t + i * r : a.swipeLeft = t + i * (a.$list.height() / a.listWidth) * r, !0 === a.options.verticalSwiping && (a.swipeLeft = t + i * r), !0 !== a.options.fade && !1 !== a.options.touchMove && (!0 === a.animating ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))))
		}, t.prototype.swipeStart = function (e) {
			var t, n = this;
			if (n.interrupted = !0, 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow) return n.touchObject = {}, !1;
			e.originalEvent !== undefined && e.originalEvent.touches !== undefined && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = t !== undefined ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = t !== undefined ? t.pageY : e.clientY, n.dragging = !0
		}, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function () {
			var e = this;
			null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
		}, t.prototype.unload = function () {
			var t = this;
			e(".slick-cloned", t.$slider).remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
		}, t.prototype.unslick = function (e) {
			var t = this;
			t.$slider.trigger("unslick", [t, e]), t.destroy()
		}, t.prototype.updateArrows = function () {
			var e = this;
			Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
		}, t.prototype.updateDots = function () {
			var e = this;
			null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
		}, t.prototype.visibility = function () {
			var e = this;
			e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
		}, e.fn.slick = function () {
			var e, n, i = this,
				r = arguments[0],
				o = Array.prototype.slice.call(arguments, 1),
				s = i.length;
			for (e = 0; e < s; e++)
				if ("object" == typeof r || void 0 === r ? i[e].slick = new t(i[e], r) : n = i[e].slick[r].apply(i[e].slick, o), void 0 !== n) return n;
			return i
		}
	}),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("admin", "users") || page("admin", "translations") || page("admin", "new_invoice")) return autosize($("textarea")), $(".select2").select2(), $(".translate-from-locale, .translate-to-locale, .translate-category").change(function () {
				return window.location = "?from=" + $(".translate-from-locale").val() + "&to=" + $(".translate-to-locale").val() + "&category=" + $(".translate-category").val()
			}), $(".translations-form").on("ajax:success", function () {
				return $(".translation-area").each(function () {
					return "" === $(this).val() ? $(this).css("border", "2px solid red") : $(this).css("border", "")
				})
			}), $(".overwrite-range").flatpickr({
				mode: "range"
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("events", "index")) return $("#new-event-modal").on("shown.bs.modal", function () {
				return $("#event_name").select()
			}), $("#new_event").on("ajax:success", function (e, t) {
				return $("#event_name").val(""), 0 === $(".event").length && $("#events, #no-events").toggle(), $("#events").append(t.html), $("#new-event-modal").modal("toggle")
			}), Sortable.create($("#events").get(0), {
				animation: 150,
				handle: ".event-handle",
				forceFallback: !0,
				onUpdate: function () {
					var e;
					return e = $(".event").map(function () {
						return $(this).find(".event-id").val()
					}), $.ajax({
						type: "PATCH",
						url: $(".event-positions-url").val(),
						data: {
							event_ids: e.toArray()
						}
					})
				}
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("events", "show")) return $("#display-listener-messages").on("change", function () {
				return $(".with-listener-message, .without-listener-message").toggleClass("d-none")
			}), $("body").on("click", ".edit-event", function () {
				return $("#edit-event-modal #event-id").val($(this).data("id")), $("#edit-event-modal #name").val($(this).data("name")), $("#edit-event-modal #listener-password").val($(this).data("listener-password")), $("#edit-event-modal #speaker-password").val($(this).data("speaker-password"))
			}), $("body").on("click", ".edit-location", function () {
				return $("#edit-location-modal #event-id").val($(this).data("id")), $("#edit-location-modal #name").val($(this).data("name")), $("#edit-location-modal #is-discoverable").prop("checked", !0 === $(this).data("is-discoverable")), $("#edit-location-modal #street").val($(this).data("street")), $("#edit-location-modal #postalcode").val($(this).data("postalcode")), $("#edit-location-modal #city").val($(this).data("city")), $("#radius-100").prop("checked", 100 === $(this).data("radius")), $("#radius-1000").prop("checked", 1e3 === $(this).data("radius")), $("#radius-10000").prop("checked", 1e4 === $(this).data("radius") || void 0 === $(this).data("radius")), $(".event-discoverable").toggle(!0 === $(this).data("is-discoverable"))
			}), $("body").on("click", ".edit-contact-info", function () {
				return $("#edit-contact-info-modal #event-id").val($(this).data("id")), $("#edit-contact-info-modal #website").val($(this).data("website")), $("#edit-contact-info-modal #email").val($(this).data("email")), $("#edit-contact-info-modal #phone").val($(this).data("phone"))
			}), $("#edit-event-modal").on("shown.bs.modal", function () {
				return $("#edit-event-modal #name").select()
			}), $("#edit-location-modal #is-discoverable").change(function () {
				return $(".event-discoverable").toggle()
			}), $("body").on("click", ".delete-event", function () {
				return $("#delete-event-modal .delete-event-btn").attr("href", $(this).data("url"))
			}), $("#edit-event-modal").on("ajax:success", ".update-event-form", function (e, t) {
				return $("body .edit-event").data("name", t.name),
					$("body .edit-event").data("speaker-password", t.speaker_password), $("body .edit-event").data("listener-password", t.listener_password), $("#edit-event-modal").modal("toggle")
			}), $("#edit-location-modal").on("ajax:success", ".update-location-form", function (e, t) {
				return $("body .edit-location").data("name", t.name), $("body .edit-location").data("is-discoverable", t.is_discoverable), $("body .edit-location").data("street", t.street), $("body .edit-location").data("postalcode", t.postalcode), $("body .edit-location").data("city", t.city), $("body .edit-location").data("radius", t.radius), $("#edit-location-modal").modal("toggle")
			}), $("#edit-contact-info-modal").on("ajax:success", ".update-contact-info-form", function (e, t) {
				return $("body .edit-contact-info").data("website", t.website), $("body .edit-contact-info").data("email", t.email), $("body .edit-contact-info").data("phone", t.phone), $("#edit-contact-info-modal").modal("toggle")
			}), $("#streams").on("click", ".invite-speaker", function () {
				return $("#invite-speaker-modal #speaker-code").val($(this).data("code")), $("#invite-speaker-modal .visible-speaker-code").text($(this).data("code")), $("#invite-speaker-modal .stream-name").text($(this).data("name")), $("#invite-speaker-modal #speaker-link").val($(this).data("link"))
			}), $("#streams").on("click", ".edit-stream", function () {
				return $("#edit-stream-modal #stream-id").val($(this).data("id")), $("#edit-stream-modal #name").val($(this).data("name"))
			}), $("#new-stream-modal").on("shown.bs.modal", function () {
				return $("#stream_name").select()
			}), $("#streams").on("click", ".delete-stream", function () {
				return $("#delete-stream-modal .delete-stream-btn").attr("href", $(this).data("url"))
			}), $("#new_stream").on("ajax:success", function (e, t) {
				return $("#stream_name").val(""), $("#streams").append(t.html), $("#streams, #status-messages, #new-stream, #streams-menu").show(), $(".invite-listeners").removeClass("disabled"), $("#no-streams").hide(), $("#new-stream-modal").modal("toggle")
			}), $("#edit-stream-modal").on("shown.bs.modal", function () {
				return $("#edit-stream-modal #name").select()
			}), $("#edit-stream-modal").on("ajax:success", ".update-stream-form", function (e, t) {
				return $(".stream[data-id=" + t.id + "] .edit-stream").data("name", t.name), $(".stream[data-id=" + t.id + "] .invite-speaker").data("name", t.name), $("#edit-stream-modal").modal("toggle")
			}), $("#delete-stream-modal").on("ajax:success", ".delete-stream-btn", function (e, t) {
				return $(".delete-stream[data-id=" + t.id + "]").parents(".stream").remove(), $("#streams, #status-messages, #new-stream, #streams-menu").toggle(0 !== $(".stream").length), $("#no-streams").toggle(0 === $(".stream").length), $(".invite-listeners").toggleClass("disabled", 0 === $(".stream").length), $("#delete-stream-modal").modal("toggle")
			}), $("body").on("click", ".open-listener-message-modal", function () {
				return $("#set-listener-message-modal input[name=listener_status_message]").val($(this).data("message"))
			}), $("#set-listener-message-modal").on("shown.bs.modal", function () {
				return $("input[name=listener_status_message]").select()
			}), $("body").on("ajax:success", "#set-listener-message-modal, .destroy-listener-message", function (e, t) {
				return $("#set-listener-message-modal").modal("hide"), $(".listener-status-message").html(t.html)
			}), $("body").on("click", ".open-speaker-message-modal", function () {
				return $("#set-speaker-message-modal input[name=speaker_status_message]").val($(this).data("message"))
			}), $("body").on("ajax:success", "#set-speaker-message-modal, .destroy-speaker-message", function (e, t) {
				return $("#set-speaker-message-modal").modal("hide"), $(".speaker-status-message").html(t.html)
			}), $("#set-speaker-message-modal").on("shown.bs.modal", function () {
				return $("input[name=speaker_status_message]").select()
			}), $("body").on("click", ".delete-recording", function () {
				return $("#delete-recording-modal .delete-recording-btn").attr("href", $(this).data("url"))
			}), $("#delete-recording-modal").on("ajax:success", ".delete-recording-btn", function (e, t) {
				var n;
				return 1 === (n = $(".recording[data-key='" + t.key + "']")).parents(".recordings").find(".recording").length && n.parents(".stream-recordings").find(".recordings, .no-recordings").toggleClass("d-none"), n.remove(), $("#delete-recording-modal").modal("toggle")
			}), $("header").on("change", "input[type=checkbox].set-state ", function () {
				return $.ajax({
					type: "PATCH",
					url: $(this).data("url"),
					data: {
						id: $(this).data("id"),
						state: $(this).is(":checked") ? "active" : "inactive"
					}
				})
			}), Sortable.create($("#streams").get(0), {
				animation: 150,
				handle: ".stream-handle",
				forceFallback: !0,
				onUpdate: function () {
					var e;
					return e = $(".stream").map(function () {
						return $(this).data("id")
					}), $.ajax({
						type: "PATCH",
						url: $(".stream-positions-url").val(),
						data: {
							"stream[event_id]": $(".event-id").val(),
							stream_ids: e.toArray()
						}
					})
				}
			}), new Dropzone("#header-image", {
				headers: {
					"X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
				},
				maxFiles: 1,
				thumbnailWidth: 1100,
				thumbnailHeight: 265,
				acceptedFiles: ".jpeg,.jpg,.png",
				addRemoveLinks: !0,
				dictRemoveFile: $("#header-image").data("remove-text"),
				init: function () {
					var e;
					return void 0 !== $(this.element).data("image-url") && (e = {
						name: "header",
						size: 0,
						type: "image/jpeg",
						accepted: !0
					}, this.files.push(e), this.displayExistingFile(e, $(this.element).data("image-url"), null, "anonymous")), $(this.element).find(".dz-preview").click(function () {
						return $("#header-image").click()
					})
				},
				maxfilesexceeded: function (e) {
					return this.removeAllFiles(), this.addFile(e)
				},
				removedfile: function (e) {
					return e.previewElement.remove(), $.ajax({
						type: "POST",
						url: $("#header-image").attr("action"),
						data: {
							file: null
						}
					})
				}
			}), $("#logo-image").dropzone({
				headers: {
					"X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
				},
				maxFiles: 1,
				thumbnailWidth: 200,
				thumbnailHeight: 113,
				acceptedFiles: ".jpeg,.jpg,.png",
				addRemoveLinks: !0,
				dictRemoveFile: $("#logo-image").data("remove-text"),
				init: function () {
					var e;
					return void 0 !== $(this.element).data("image-url") && (e = {
						name: "logo",
						size: 0,
						type: "image/jpeg",
						accepted: !0
					}, this.files.push(e), this.displayExistingFile(e, $(this.element).data("image-url"), null, "anonymous")), $(this.element).find(".dz-preview").click(function () {
						return $("#logo-image").click()
					})
				},
				maxfilesexceeded: function (e) {
					return this.removeAllFiles(), this.addFile(e)
				},
				removedfile: function (e) {
					return e.previewElement.remove(), $.ajax({
						type: "POST",
						url: $("#logo-image").attr("action"),
						data: {
							file: null
						}
					})
				}
			}), document.addEventListener("turbolinks:before-cache", function () {
				return $(".dz-preview").remove()
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("static", "join_event") || page("static", "join_event_browser")) return $("#joinEventCollapse").on("shown.bs.collapse", function () {
				return $(".code-input").focus()
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("static", "simultaneous_interpretation") || page("static", "audio_transmission") || page("static", "guided_tours") || page("static", "churches")) return $("#joinEventCollapse").on("shown.bs.collapse", function () {
				return $(".code-input").focus()
			}), $(".use-case__link").hover(function () {
				return $(".use-case__link").removeClass("hover"), $(this).addClass("hover")
			}), $(".slider").slick({
				arrows: !0,
				dots: !1,
				autoplay: !0,
				autoplaySpeed: 4e3,
				fade: !0,
				speed: 800,
				prevArrow: '<button type="button" class="slick-prev"><i class="material-icons">chevron_left</i></button>',
				nextArrow: '<button type="button" class="slick-next"><i class="material-icons">chevron_right</i></button>',
				pauseOnHover: !1
			}), $(".quote-slider").slick({
				centerMode: !0,
				centerPadding: "160px",
				slidesToShow: 3,
				focusOnSelect: !0,
				arrows: !1,
				adaptiveHeight: !1,
				responsive: [{
					breakpoint: 1700,
					settings: {
						centerPadding: "20vw",
						slidesToShow: 1
					}
				}, {
					breakpoint: 1100,
					settings: {
						centerPadding: "15vw",
						slidesToShow: 1
					}
				}, {
					breakpoint: 500,
					settings: {
						centerPadding: "40px",
						slidesToShow: 1
					}
				}]
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("static", "pricing")) return $(".pricing-select").change(function () {
				return $(".pricing-free").toggleClass("d-none", $(this).val() !== $(".pricing-range").attr("min")), $(".pricing-standard").toggleClass("d-none", $(this).val() === $(".pricing-range").attr("min") || $(this).val() === $(".pricing-range").attr("max")), $(".pricing-more").toggleClass("d-none", $(this).val() !== $(".pricing-range").attr("max")), $(".daily-price").text($(this).find(":selected").data("daily-price")), $(".monthly-price").text($(this).find(":selected").data("monthly-price")), $(".yearly-price").text($(this).find(":selected").data("yearly-price")), $(".pricing-range").val($(this).val())
			}), $(".pricing-range").on("input", function () {
				return $(".pricing-select").val($(this).val()), $(".pricing-select").change()
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("static", "welcome")) return $("#joinEventCollapse").on("shown.bs.collapse", function () {
				return $(".code-input").focus()
			}), $(".use-case__link").hover(function () {
				return $(".use-case__link").removeClass("hover"), $(this).addClass("hover")
			}), $(".quote-slider").slick({
				centerMode: !0,
				centerPadding: "160px",
				slidesToShow: 3,
				focusOnSelect: !0,
				arrows: !1,
				adaptiveHeight: !1,
				responsive: [{
					breakpoint: 1700,
					settings: {
						centerPadding: "20vw",
						slidesToShow: 1
					}
				}, {
					breakpoint: 1100,
					settings: {
						centerPadding: "15vw",
						slidesToShow: 1
					}
				}, {
					breakpoint: 500,
					settings: {
						centerPadding: "40px",
						slidesToShow: 1
					}
				}]
			})
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("streams", "embedded")) return isMobile() ? $(".appstore-badges").removeClass("d-none").addClass("d-flex") : void 0
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			var e, t, n, i, r, o, s, a, c, l, d, u, p, f, h, m, g;
			if (page("events", "show") || page("streams", "index") || page("streams", "embedded")) return $("a").attr("data-turbolinks", "false"), h = [$(".janus-wss-url").val(), $(".janus-https-url").val()], n = $(".janus-auth-token").val(), s = !0, f = 1234, c = null, u = null, g = null, Janus.init({
					debug: s,
					callback: function () {
						return Janus.isWebrtcSupported() || alert("No WebRTC support"), c = new Janus({
							server: h,
							token: n,
							success: function () {
								return a(function () {
									if ($("#token").length && "" === $("#lobby").val() && "" === $("#standby").val() && e(), $("#streams").length) return t()
								})
							},
							error: function () {
								return Janus.log("Could not init janus")
							}
						})
					}
				}), d = null, p = null, e = function () {
					return c.attach({
						plugin: "janus.plugin.videoroom",
						success: function (e) {
							return Janus.log("Plugin attached as publisher!"), (d = e).send({
								message: {
									request: "join",
									room: f,
									ptype: "publisher",
									display: $("#token").val()
								}
							})
						},
						consentDialog: function () {
							return Janus.log("Consent required")
						},
						onmessage: function (e, t) {
							if (Janus.log("--- Message Publisher"), Janus.log(e, t), "joined" === e.videoroom && (p = e.id, d.createOffer({
									media: {
										audioRecv: !1,
										audioSend: !0,
										video: !1
									},
									success: function (e) {
										return Janus.log(e), d.send({
											message: {
												request: "publish",
												audio: !0,
												video: !1,
												record: "true" === $("#record").val(),
												filename: $("#record-file-prefix").val() + Math.round((new Date).getTime() / 1e3) + "_" + p
											},
											jsep: e
										})
									},
									error: function (e) {
										return Janus.error("WebRTC error:", e)
									}
								})), null != t) return d.handleRemoteJsep({
								jsep: t
							})
						},
						onlocalstream: function (e) {
							return Janus.log("Got a local stream"), App.event_channel.speak({
								type: "publisher_streams",
								janus_publisher_id: p
							}), "true" === $("#start-muted").val() ? (d.muteAudio(), App.event_channel.speak({
								type: "muted"
							})) : i("streaming"), null !== u && u.stop(), (u = hark(e)).on("volume_change", function (e) {
								var t;
								return t = o(e) / 4, $(".speaker-volume").show().css("transform", "scale(" + (t + .8) + ")")
							})
						}
					})
				}, m = null, t = function (e, t) {
					return c.attach({
						plugin: "janus.plugin.videoroom",
						success: function (n) {
							return Janus.log("Plugin attached as subscriber!"), (m = n).send({
								message: {
									request: "listparticipants",
									room: f
								},
								success: function (n) {
									var i;
									if ($(".listen").each(function () {
											var e, t;
											return e = $(this), t = $.grep(n.participants, function (t) {
												return t.display === e.data("token")
											}).length, e.toggleClass("inactive", !t)
										}), e && t) return i = $.grep(n.participants, function (e) {
										return e.display === t
									}).pop().id, m.send({
										message: {
											request: "join",
											room: f,
											ptype: "subscriber",
											feed: i
										}
									})
								}
							})
						},
						onremotestream: function (e) {
							return Janus.log("Got a remote stream"), Janus.attachMediaStream($("#listener-audio").get(0), e), null !== g && g.stop(), (g = hark(e)).on("volume_change", function (e) {
								var t;
								return t = o(e), $(".listen.playing").parents(".stream").find(".volume").show().css({
									width: t
								})
							})
						},
						onmessage: function (e, t) {
							if (Janus.log("--- Message Subscriber"), Janus.log(e, t), "attached" === e.videoroom) return Janus.log("Attached"), m.createAnswer({
								jsep: t,
								media: {
									audioRecv: !0,
									audioSend: !1,
									video: !1
								},
								success: function (e) {
									return Janus.log(e), m.send({
										message: {
											request: "start"
										},
										jsep: e
									})
								},
								error: function (e) {
									return Janus.error("WebRTC error:", e)
								}
							})
						},
						error: function (e) {
							return Janus.error("Error: attaching plugin...", e)
						}
					})
				}, l = null, a = function (e) {
					if ($(".event-id").length) return Janus.log("Created events channel"), App.event_channel = App.cable.subscriptions.create({
						channel: "EventChannel",
						event_id: $(".event-id").val(),
						stream_code: $("#stream-code").val(),
						session_id: c.getSessionId()
					}, {
						connected: function () {
							return e(), $("#token").length && "" === $("#lobby").val() && "" === $("#standby").val() ? (clearInterval(l), l = setInterval(function () {
								return App.event_channel.pong({
									janus_handle_id: d.getId(),
									janus_session_id: c.getSessionId()
								})
							}, 3e3)) : $("#token").length ? void 0 : (clearInterval(l), l = setInterval(function () {
								return App.event_channel.pong()
							}, 1e4))
						},
						speak: function (e) {
							return null == e && (e = {}), this.perform("speak", e)
						},
						pong: function (e) {
							return null == e && (e = {}), this.perform("pong", e)
						},
						received: function (e) {
							var n;
							switch (Janus.log(e), e.type) {
								case "publisher_streams":
									if ((n = $(".stream[data-id=" + e.stream_id + "]")).find(".listen").removeClass("inactive"), n.find(".listen").hasClass("playing") && m.send({
											message: {
												request: "leave"
											},
											success: function () {
												return t(n.data("id"), n.find(".listen").data("token"))
											}
										}), n.find(".listen").attr("data-publisher-id", e.janus_publisher_id), $("#token").length && "" === $("#lobby").val() && "" === $("#standby").val() && $("#stream-id").val() === String(e.stream_id) && null !== p && p !== e.janus_publisher_id && (window.location.search += "&standby=true"), e.reconnecting && void 0 !== n.find(".listen").attr("data-publisher-left-at") && n.find(".listen").attr("data-publisher-left-at") > Date.now() - 1e3 * n.find(".listen").data("timeout")) return n.find(".listen").click();
									break;
								case "publisher_left":
									if ((n = $(".stream[data-id=" + e.stream_id + "]")).find(".listen").attr("data-publisher-id") !== String(e.janus_publisher_id)) return;
									return n.find(".listen").hasClass("playing") && n.find(".listen").attr("data-publisher-left-at", Date.now()), n.find(".listen").addClass("inactive").removeClass("playing"), n.find(".muted, .volume").hide();
								case "muted":
									return $(".stream[data-id=" + e.stream_id + "] .muted").show();
								case "unmuted":
									return $(".stream[data-id=" + e.stream_id + "] .muted").hide();
								case "record_on":
									if (String(e.stream_id) === $("#stream-id").val()) return $(".recording-label").show(), d.send({
										message: {
											request: "configure",
											record: !0,
											filename: $("#record-file-prefix").val() + Math.round((new Date).getTime() / 1e3) + "_" + p
										}
									});
									break;
								case "record_off":
									if (String(e.stream_id) === $("#stream-id").val()) return $(".recording-label").hide(), d.send({
										message: {
											request: "configure",
											record: !1
										}
									});
									break;
								case "event_name_changed":
									return $(".event-title").text(e.name);
								case "stream_name_changed":
									return String(e.stream_id) === $("#stream-id").val() && ($(".stream-control-title").text(e.name), $(".stream-title").text(e.name)), (n = $(".stream[data-id=" + e.stream_id + "]")).find(".stream-name").text(e.name);
								case "event_contact_info_changed":
									return $(".contact-info-website").text(e.website), $(".contact-info-email").text(e.email), $(".contact-info-phone").text(e.phone);
								case "event_listener_status_message_changed":
									return $(".listener-status-message-banner").toggleClass("d-none", "" === e.status_message), $(".listener-status-message-banner strong").html(e.status_message);
								case "event_speaker_status_message_changed":
									return $(".speaker-status-message-banner").toggleClass("d-none", "" === e.status_message), $(".speaker-status-message-banner strong").html(e.status_message)
							}
						}
					})
				}, o = function (e) {
					return (e += 80) < 0 && (e = 0), e > 100 && (e = 100), e
				}, i = function (e) {
					if ($(".stream-control-label").hide(), $(".stream-control-label-" + e).show(), $(".stream-controls").removeClass("muted offline streaming requesting"), $(".stream-controls").addClass(e), /^(muted|offline)$/i.test(e) ? ($("#mute .material-icons").text("mic_off"), $("#mute").addClass("muted")) : ($("#mute .material-icons").text("mic"), $("#mute").removeClass("muted")), $(".listeners-label, .in-link-quality-label").toggle(!/^(offline)$/i.test(e)), $(".btn-start-streaming").toggleClass("disabled", /^(offline)$/i.test(e)), /^(offline)$/i.test(e)) return $(".recording-label").hide()
				}, $("#mute").click(function () {
					var e;
					if (!$(".stream-control-label-offline").is(":visible") && !$(".stream-control-label-requesting").is(":visible")) return d.isAudioMuted() ? d.unmuteAudio() : d.muteAudio(), App.event_channel.speak({
						type: $(this).hasClass("muted") ? "unmuted" : "muted"
					}), i($(this).hasClass("muted") ? "streaming" : "muted"), e = new URL(location.href), d.isAudioMuted() ? e.searchParams.set("muted", "true") : e.searchParams["delete"]("muted"), history.pushState({}, "", e.toString())
				}), $(".listen").click(function () {
					var e, n, i;
					return i = $(this).data("token"), n = $(this).parents(".stream").data("id"), (e = $(this)).hasClass("playing") ? $("audio").get(0).play() : $("audio").get(0).pause(), $(".stream .volume").hide(), $(".listen.playing").not(this).length ? ($(".listen").removeClass("playing"), $(".listen").removeAttr("data-publisher-left-at"), e.addClass("playing"), m.send({
						message: {
							request: "leave"
						},
						success: function () {
							return t(n, i)
						}
					})) : e.hasClass("playing") ? (e.removeClass("playing"), e.removeAttr("data-publisher-left-at"), m.send({
						message: {
							request: "leave"
						}
					})) : (e.addClass("playing"), t(n, i)), (new NoSleep).enable()
				}), $(".copy-code").on("click", function () {
					var e;
					return $(this).parents(".modal-content").find("#listener-code, #speaker-code").select(), document.execCommand("copy"), (e = $(this)).text(e.data("copied-text")), setTimeout(function () {
						return e.text(e.data("default-text"))
					}, 1e3), !1
				}), $(".copy-link").on("click", function () {
					var e;
					return $(this).parents(".modal-content").find("#listener-link, #speaker-link").select(), document.execCommand("copy"), (e = $(this)).text(e.data("copied-text")), setTimeout(function () {
						return e.text(e.data("default-text"))
					}, 1e3), !1
				}), $(".copy-iframe").on("click", function () {
					var e;
					return $(this).parents(".with-listener-message, .without-listener-message").find(".iframe-code").select(), document.execCommand("copy"), (e = $(this)).text(e.data("copied-text")), setTimeout(function () {
						return e.text(e.data("default-text"))
					}, 1e3), !1
				}), $("#token").length && isMobile() && $(".speaker-mobile-browser").show(), window.addEventListener("load", function () {
					return window.addEventListener("offline", function () {
						return i("offline"), $(".stream[data-id] .listen").addClass("inactive").removeClass("playing"), $(".stream[data-id] .muted, .volume").hide(), clearInterval(r)
					}), window.addEventListener("online", function () {
						return location.reload()
					})
				}), r = null,
				function () {
					return clearInterval(r), r = setInterval(function () {
						if ($("#stream-code").length) return null === d && "" === $("#lobby").val() && "" === $("#standby").val() && (console.log("Can't find Janus handle: Reloading"), location.reload()), $.get({
							url: $("#is-up-path").val(),
							data: {
								stream_code: $("#stream-code").val()
							},
							success: function (e) {
								if (!$.isEmptyObject(e)) return $("#listener-counter").text(e.listeners), $("#in-link-quality").text(e.in_link_quality + "%")
							},
							error: function () {
								return console.log("Can't connect to LV server"), location.reload()
							}
						})
					}, 1e4)
				}()
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("registrations", "edit") || page("registrations", "new") || page("confirmations", "show") || page("registrations", "cancel_account") || page("registrations", "account") || page("registrations", "billing_credentials")) return $(".signup-form").submit(function () {
				return $("#accept-privacy").toggleClass("error", !$("#accept-privacy").is(":checked")), $("#accept-privacy").is(":checked")
			}), $(".select2").select2(), $(".auto-upgrade-slider").on("input change", function () {
				return $(".auto-upgrade-label").text($(this).val())
			}), page("registrations", "billing_credentials") && "" === $(".time-zone-select").val() ? ($(".mock-time-zone-select").val(Intl.DateTimeFormat().resolvedOptions().timeZone), $(".mock-time-zone-select option:selected").length && $(".time-zone-select").val($(".mock-time-zone-select option:selected").text()), $(".edit_user").submit(function () {
				return gtag("event", "conversion", {
					send_to: "AW-1013875542/0KhvCKCv2NEBENaGuuMD"
				})
			})) : void 0
		})
	}.call(this),
	function () {
		$(document).on("turbolinks:load", function () {
			if (page("payments", "pick_days") || page("payments", "edit_day") || page("payments", "choose_daily_plan") || page("payments", "choose_subscription_plan") || page("payments", "choose_auto_upgrade") || page("payments", "cancel_subscription")) return $("body").on("click", ".switch-plan", function () {
				return $("#switch-plan-modal .modal-body .loading").show(), $("#switch-plan-modal .modal-body .content").empty()
			}), $("body").on("ajax:success", ".switch-plan", function (e, t) {
				return $("#switch-plan-modal .modal-body .loading").hide(), $("#switch-plan-modal .modal-body .content").html(t.body), $("#switch-plan-modal .confirm-switch").attr("href", t.link)
			}), $("body").on("click", ".confirm-switch", function () {
				return $(this).addClass("disabled")
			}), $(".pricing-select").change(function () {
				return $(".pricing-standard").toggleClass("d-none", $(this).val() === $(".pricing-range").attr("max")), $(".pricing-more").toggleClass("d-none", $(this).val() !== $(".pricing-range").attr("max")), $(".daily-price").text($(this).find(":selected").data("daily-price")), $(".monthly-price").text($(this).find(":selected").data("monthly-price")), $(".yearly-price").text($(this).find(":selected").data("yearly-price")), $(".pricing-range").val($(this).val()), $(".plan-select").addClass("d-none"), $(this).find(":selected").attr("data-daily-plan") ? $(".plan-select[data-plan=" + $(this).find(":selected").data("daily-plan") + "]").removeClass("d-none") : $(".monthly-annually-switch").is(":checked") ? $(".plan-select[data-plan=" + $(this).find(":selected").data("yearly-plan") + "]").removeClass("d-none") : $(".plan-select[data-plan=" + $(this).find(":selected").data("monthly-plan") + "]").removeClass("d-none")
			}), $(".pricing-range").on("input", function () {
				return $(".pricing-select").val($(this).val()), $(".pricing-select").change()
			}), $(".monthly-annually-switch").change(function () {
				return $(".billed-monthly, .billed-annually").toggleClass("d-none"), $(".pricing-select").change()
			}), $(".make-day-visible").click(function () {
				if ($(".day.d-none:first").removeClass("d-none"), !$(".day.d-none").length) return $(this).remove()
			}), $(".clear-day").click(function () {
				return $(this).parents(".day").find(".days").val(""), $(this).addClass("d-none")
			}), $(".days").each(function () {
				var e;
				return (e = $(this)).flatpickr({
					minDate: "today",
					disable: e.data("disabled-dates").split(",") || [],
					onChange: function () {
						return e.parents(".day").find(".clear-day").removeClass("d-none")
					}
				})
			}), $(".select2").select2(), $(".set-auto-upgrade").change(function () {
				return $(".auto-upgrade-select").toggleClass("d-none"), $("[name=auto_upgrade_listener_limit]").attr("required", $(this).is(":checked"))
			})
		})
	}.call(this),
	function () {
		this.page = function (e, t) {
			return $("body").attr("data-controller-name") === e && $("body").attr("data-action-name") === t
		}, this.isMobile = function () {
			return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(navigator.userAgent.toLowerCase())
		}, $(document).on("turbolinks:load", function () {
			var e;
			return Janus.isWebrtcSupported || $("body").addClass("no-webrtc"), $(".accept-cookies").click(function () {
				return $.cookie("ACCEPT_COOKIES", "TRUE", {
					expires: 1800
				}), $(".cookie-notice").hide(), !1
			}), e = $("meta[name=language]").attr("content"), $("html").attr("lang", e)
		})
	}.call(this);