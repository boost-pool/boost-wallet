import {
    createPopup,
    extractKeyHash,
    getAddress,
    getBalance,
    getCollateral,
    getNetwork,
    getRewardAddress,
    getUtxos,
    isWhitelisted,
    submitTx,
    verifyPayload,
    verifyTx,
} from '../extension';
import { Messaging } from './messaging';
import { APIError, METHOD, POPUP, SENDER, TARGET } from './config';
import {set} from "../../db/storage";

const app = Messaging.createBackgroundController();

/**
 * listens to requests from the web context
 */

app.add(METHOD.getBalance, (request, sendResponse) => {
    getBalance()
        .then((value) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                // @ts-ignore
                data: Buffer.from(value.to_bytes(), 'hex').toString('hex'),
                target: TARGET,
                sender: SENDER.extension,
            });
        })
        .catch((e) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: e,
                target: TARGET,
                sender: SENDER.extension,
            });
        });
});

app.add(METHOD.enable, async (request, sendResponse) => {
    // @ts-ignore
    isWhitelisted(request.origin)
        .then(async (whitelisted) => {
            // @ts-ignore
            if (whitelisted) {
                sendResponse({
                    // @ts-ignore
                    id: request.id,
                    data: true,
                    target: TARGET,
                    sender: SENDER.extension,
                });
            } else {
                const response = await createPopup(POPUP.internal)
                    .then((tab) => Messaging.sendToPopupInternal(tab, request))
                    .then((response) => response);
                if (response.data === true) {
                    sendResponse({
                        // @ts-ignore
                        id: request.id,
                        data: true,
                        target: TARGET,
                        sender: SENDER.extension,
                    });
                } else if (response.error) {
                    sendResponse({
                        // @ts-ignore
                        id: request.id,
                        error: response.error,
                        target: TARGET,
                        sender: SENDER.extension,
                    });
                } else {
                    sendResponse({
                        // @ts-ignore
                        id: request.id,
                        error: APIError.InternalError,
                        target: TARGET,
                        sender: SENDER.extension,
                    });
                }
            }
        })
        .catch(() =>
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: APIError.InternalError,
                target: TARGET,
                sender: SENDER.extension,
            })
        );
});

app.add(METHOD.isEnabled, (request, sendResponse) => {
    // @ts-ignore
    isWhitelisted(request.origin)
        .then((whitelisted) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: whitelisted,
                target: TARGET,
                sender: SENDER.extension,
            });
        })
        .catch(() => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: APIError.InternalError,
                target: TARGET,
                sender: SENDER.extension,
            });
        });
});

app.add(METHOD.getAddress, async (request, sendResponse) => {
    const address = await getAddress();
    // @ts-ignore
    if (address) {
        sendResponse({
            // @ts-ignore
            id: request.id,
            data: address,
            target: TARGET,
            sender: SENDER.extension,
        });
    } else {
        sendResponse({
            // @ts-ignore
            id: request.id,
            error: APIError.InternalError,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.add(METHOD.getRewardAddress, async (request, sendResponse) => {
    try {
        const address = await getRewardAddress();
        // @ts-ignore
        if (address) {
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: address,
                target: TARGET,
                sender: SENDER.extension,
            });
        } else {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: APIError.InternalError,
                target: TARGET,
                sender: SENDER.extension,
            });
        }
    } catch (e) {
        sendResponse({
            // @ts-ignore
            id: request.id,
            error: APIError.InternalError,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.add(METHOD.getUtxos, (request, sendResponse) => {
    // @ts-ignore
    getUtxos(request.data.amount, request.data.paginate)
        .then((utxos) => {
            // @ts-ignore
            utxos = utxos
                // @ts-ignore
                ? utxos.map((utxo) =>
                    Buffer.from(utxo.to_bytes(), 'hex').toString('hex')
                )
                : null;
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: utxos,
                target: TARGET,
                sender: SENDER.extension,
            });
        })
        .catch((e) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: e,
                target: TARGET,
                sender: SENDER.extension,
            });
        });
});

app.add(METHOD.getCollateral, (request, sendResponse) => {
    getCollateral()
        .then((utxos) => {
            // @ts-ignore
            utxos = utxos.map((utxo) =>
                Buffer.from(utxo.to_bytes(), 'hex').toString('hex')
            );
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: utxos,
                target: TARGET,
                sender: SENDER.extension,
            });
        })
        .catch((e) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: e,
                target: TARGET,
                sender: SENDER.extension,
            });
        });
});

app.add(METHOD.submitTx, (request, sendResponse) => {
    // @ts-ignore
    submitTx(request.data)
        .then((txHash) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: txHash,
                target: TARGET,
                sender: SENDER.extension,
            });
        })
        .catch((e) => {
            sendResponse({
                // @ts-ignore
                id: request.id,
                target: TARGET,
                error: e,
                sender: SENDER.extension,
            });
        });
});

app.add(METHOD.isWhitelisted, async (request, sendResponse) => {
    // @ts-ignore
    const whitelisted = await isWhitelisted(request.origin);
    // @ts-ignore
    if (whitelisted) {
        sendResponse({
            data: whitelisted,
            target: TARGET,
            sender: SENDER.extension,
        });
    } else {
        sendResponse({
            error: APIError.Refused,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.add(METHOD.getNetworkId, async (request, sendResponse) => {
    const networkMap = { mainnet: 1, testnet: 0 };
    const network = await getNetwork();
    // @ts-ignore
    if (network)
        sendResponse({
            // @ts-ignore
            id: request.id,
            // @ts-ignore
            data: networkMap[network.id],
            target: TARGET,
            sender: SENDER.extension,
        });
    else
        sendResponse({
            // @ts-ignore
            id: request.id,
            error: APIError.InternalError,
            target: TARGET,
            sender: SENDER.extension,
        });
});

app.add(METHOD.signData, async (request, sendResponse) => {
    try {
        // @ts-ignore
        verifyPayload(request.data.payload);
        // @ts-ignore
        await extractKeyHash(request.data.address);

        const response = await createPopup(POPUP.internal)
            .then((tab) => Messaging.sendToPopupInternal(tab, request))
            .then((response) => response);

        if (response.data) {
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: response.data,
                target: TARGET,
                sender: SENDER.extension,
            });
        } else if (response.error) {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: response.error,
                target: TARGET,
                sender: SENDER.extension,
            });
        } else {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: APIError.InternalError,
                target: TARGET,
                sender: SENDER.extension,
            });
        }
    } catch (e) {
        sendResponse({
            // @ts-ignore
            id: request.id,
            error: e,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.add(METHOD.signTx, async (request, sendResponse) => {
    try {
        // @ts-ignore
        await verifyTx(request.data.tx);
        const response = await createPopup(POPUP.internal)
            .then((tab) => Messaging.sendToPopupInternal(tab, request))
            .then((response) => response);

        if (response.data) {
            sendResponse({
                // @ts-ignore
                id: request.id,
                data: response.data,
                target: TARGET,
                sender: SENDER.extension,
            });
        } else if (response.error) {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: response.error,
                target: TARGET,
                sender: SENDER.extension,
            });
        } else {
            sendResponse({
                // @ts-ignore
                id: request.id,
                error: APIError.InternalError,
                target: TARGET,
                sender: SENDER.extension,
            });
        }
    } catch (e) {
        sendResponse({
            // @ts-ignore
            id: request.id,
            error: e,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.add(METHOD.loadP2P, async (request, sendResponse) => {
    console.log("loadP2Pax");
    console.log("request1");
    console.log(request);

    try {
        console.log("try set");
        await set("loadP2P", "key:loadP2P:0");
        sendResponse({
            // @ts-ignore
            id: "request.id",
            error: "testing2",
            target: TARGET,
            sender: SENDER.extension,
        });
    } catch (e) {
        sendResponse({
            // @ts-ignore
            id: "request.id",
            error: e,
            target: TARGET,
            sender: SENDER.extension,
        });
    }
});

app.listen();

//delete localStorage globalModel

// @ts-ignore
/*
chrome.runtime.onStartup.addListener(function () {
    const entry = Object.keys(extensionStorage).find((l) =>
        l.includes('globalModel')
    );
    // @ts-ignore
    extensionStorage.removeItem(entry);
});
const entry = Object.keys(extensionStorage).find((l) => l.includes('globalModel'));
// @ts-ignore
extensionStorage.removeItem(entry);

 */

