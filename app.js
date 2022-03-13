const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require('express');

const bootstrap = async () => {
    const doc = new GoogleSpreadsheet('1BCaKRTxqgkiO3OHIBH7CSIiVLRseIUG6vzUu_AmgUlg');
    // знаю що так не можна, але залишаю ключі тут
    await doc.useServiceAccountAuth({
        // client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_email: "api-bot-dont-delete-me@need-ua.iam.gserviceaccount.com",
        // private_key: process.env.GOOGLE_PRIVATE_KEY,
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOk+HvfknVGmbR\n9Bkn4IaA+RXChodshNfaijv234dDwxdvzNW/MgkPyARd+dr693tGBJDkc3oAVo/X\n+K6b4RUwRHvTKViBrjPYoq4lZFuBAJYD7gkNOEnuf4GUWV6hywPqa18Bh24uF1fK\n8qwxfhhZQVYS2mY1Fbi/EMboofut7LDl0tuEydjg9iUuT8PTygTxrsSOOCyJ2xAG\nnogMFnDdm4frObEFRuV/Ot/Y+Og5fNbkt/eJgmQHmRCmtQ5n73Nf8UDQaT4B8JcG\nZwssPZwIIh1K3aNZBiqiWJ0VQpH8ISA7KDvlnBLnVpJUne6Wko/KbXe67a5JSMBK\nRm+JofjbAgMBAAECggEAVz3aHbhCeya2xLVniFFIzKAlQe1ptPlXZbqaf3TAXew+\n8h7aKHB7pjgNLBkQk4u/+n6EKI7iN9FW11l1eGxy89sARloAQGgvCi8OB8md4Vm7\ngTZeiUA77ObZdSrXDdI8uZwV2AH3lKyUDag184LyyoMO1FB6+LFPQBXYQzfhn/4D\nK+KbEplcHKwoY/mfG/pT20VlR242bIIR9F7lfHx3GUHZ881afMnjf/npI/i+scty\nZRZZm3/+JBF2dO7B3nZ+8FhmJ/7ktaB+jg9O+nt/IKxkSqNwIxs9DMzTrQtdb4LY\nvdlVezMedzOw1QJPrafDwkF95ARwkg2tPVCFcurbIQKBgQDmIaX0Qpl0FGbjLpI8\nxUZGGnUxF0Z8PsKN+Lt9T2Nuh8hzM7xsFjuygLGGqB71XuVXgC0s31pOoWpSIPFz\nZnyy/dXIpZVK9bccW/LY/Pd8dqR1/VnVnSzK5jZ9jYlqRxk+WFMDx2zRsSvsBMG2\nU9vGzBcjkx+nD4WY9aEPVWGO4QKBgQDlzHEZeLqLmZadeDfZl7wLHWqL5UaI3tKK\nllzuhd6Lk12mEvoSv/hZ1D/HFXvFEtrB56B6zC311JZEjnAi3i+qpN3ERuGAoyGN\nzpQiQld+Hl9sFoGxNn9HYYJHsTTWkDq/PstUHGJ4wX5L0/Q+SqCcSn+/A3voHYkX\nrkZZiS5rOwKBgQCXCDBFDUxurVEU+iSJc6L6MTUGYdMliX7f9AUAaZDFIqIAUUzw\n1uqY7PMVf9LJkF0NvxZm47L99du0SOCNrw5Z3lNm2p0PVBG3r/TCScsWyTqIIRzL\nH9sc0leisLglosHDc+4Phds6B3/e5wRG5+ROJPVuqIjWeE5io5nvWUasoQKBgFEm\n6an9IKO8EZx6n/6PvzCNqtrMlSQwzFl00EzLqdPQrvm/KeEFOkc+1WcRByyJhAeG\nLP4wrOprsMV1J9Soclzo7Agsn+Y1tdvGYDnZA9zeDQS2zgYvILOsk72NrwM23Ag9\nvMBvZbcPXfKZX1/AKwgGpyZlrJREGe3q9Z0Y/PORAoGBAKYqkalnTkzla3aoslXH\np7aVoae64xn1T+xvRYZcy2oP3JVnj9nVrXKHobsn9/6XiOtoc004UiHQnBGisT+Z\n4gTlf5B6sPjSWovH33n/itnIOcBoXtWQ4v91XkBJWTpiWrFuazkM5SiwGbTeHyr1\ny87edVWDZYRHhS3EBnrjFRkX\n-----END PRIVATE KEY-----\n"
    });

    const app = express();
    const port = 3000;

    const getInfoFromSheet = async () => {
        const citiesInfo = [];
        const allProducts = [];
        try {
            await doc.loadInfo();
            const mainSheet = doc.sheetsByIndex[0];
            const contacts = await doc.sheetsByIndex[2];
            await contacts.loadCells('A1:E28');
            const category = doc.sheetsByIndex[3];
            await category.loadCells('B3:B21');
            const rows = await mainSheet.getRows();
            // rows[0]._sheet.headerValues.forEach((e, i) => {
            //     console.log(e, i);
            // });
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                if (row["City State"] === "occupied") continue;
                if (+row["Score name city-category"]?.replace(",", "") === 0) continue;
                const rI = citiesInfo.findIndex(v => v.region === row.Region)
                if (rI > -1) {
                    const sI = citiesInfo[rI]?.cities.findIndex(v => v.name === row["City UA"]);
                    if (sI > -1) {
                        citiesInfo[rI]?.cities[sI]?.needs.push({
                            name: row["Category UA"],
                            productNeed: +row["Score name city-category"]?.replace(",", ""),
                            productNeedVolume1D: +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0,
                            optProductNeedVolume: +row["Missing needed stock, tons"]?.replace(",", "") || 0
                        });
                        citiesInfo[rI].cities[sI].cityNeedVolume1D += +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0;
                        citiesInfo[rI].cities[sI].optCityNeedVolume += +row["Missing needed stock, tons"]?.replace(",", "") || 0;
                        citiesInfo[rI].regNeedVolume1D += +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0;
                        citiesInfo[rI].optRegNeedVolume += +row["Missing needed stock, tons"]?.replace(",", "") || 0;
                    } else {
                        citiesInfo[rI]?.cities.push({
                            name: row["City UA"],
                            blocked: row["City State"],
                            cityNeed: +row["Score name city"]?.replace(",", ""),
                            cityNeedVolume1D: +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0,
                            optCityNeedVolume: +row["Missing needed stock, tons"]?.replace(",", "") || 0,
                            needs: [{
                                name: row["Category UA"],
                                productNeed: +row["Score name city-category"]?.replace(",", ""),
                                productNeedVolume1D: +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0,
                                optProductNeedVolume: +row["Missing needed stock, tons"]?.replace(",", "") || 0
                            }]
                        })
                        citiesInfo[rI].regNeedVolume1D += +row["Stock needed for 1 day, kg"]?.replace(",", "") || 0;
                        citiesInfo[rI].optRegNeedVolume += +row["Missing needed stock, tons"]?.replace(",", "") || 0;
                    }
                } else {
                    const contact = contacts._cells.find(e => e[0].value === row.Region);
                    citiesInfo.push({
                        region: row.Region,
                        regionNeed: +row["Score name region"].replace(",", ""),
                        regNeedVolume1D: +row["Stock needed for 1 day, kg"].replace(",", "") || 0,
                        optRegNeedVolume: +row["Missing needed stock, tons"].replace(",", "") || 0,
                        contacts: {
                            phone_VCA: contact[1].value,
                            telegram_VCA: contact[2].value,
                            hum_center: contact[3].value,
                            red_cross: contact[4].value,
                        },
                        cities: [{
                            name: row["City UA"],
                            blocked: row["City State"],
                            cityNeed: +row["Score name city"].replace(",", ""),
                            cityNeedVolume1D: +row["Stock needed for 1 day, kg"].replace(",", "") || 0,
                            optCityNeedVolume: +row["Missing needed stock, tons"].replace(",", "") || 0,
                            needs: [{
                                name: row["Category UA"],
                                productNeed: +row["Score name city-category"].replace(",", ""),
                                productNeedVolume1D: +row["Stock needed for 1 day, kg"].replace(",", "") || 0,
                                optProductNeedVolume: +row["Missing needed stock, tons"].replace(",", "") || 0
                            }]
                        }]
                    })
                }
            }
            category._cells.shift(3)
            category._cells.forEach(e => allProducts.push(e[1].value));
        } catch (error) {
            console.log(error);
        }

        return {citiesInfo, allProducts}
    };

    app.get('/', async (req, res) => {
        const info = await getInfoFromSheet();
        res.json(info);
    })
    
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    })
}

bootstrap()