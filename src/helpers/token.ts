"use strict";

import config from "./../config"
import ms from "ms"
import jwt from "jsonwebtoken"
import { UserRoles } from "../types";

export interface TokenPayload {
    id: string
    email: string
    type: UserRoles
    isSuspended?: boolean
    isApproved?: boolean
}

export async function __validateAuthToken(token: string): Promise<TokenPayload> {
	return new Promise(
		function (resolve, reject) {
			jwt.verify(
				token,
				Buffer.from(config.auth.access.secret, "base64"),
				{ ignoreNotBefore: true },
				function (err, payload) {
					if (err) reject(new Error("AuthorizationExpired"));
					resolve(payload as TokenPayload);
				}
			);
		}
	);
}

export async function __generateAuthToken(payload: TokenPayload): Promise<string| any> {
    return new Promise(
        function (resolve, reject) {
			jwt.sign(
				payload,
				Buffer.from(config.auth.access.secret, "base64"),
				{
					audience: config.app.name,
					issuer: config.app.name,
					expiresIn: config.auth.access.expiry,
				},
				function (err, token) {
					if (err) reject(err);
					resolve(token);
				}
			);
		}
    )
}