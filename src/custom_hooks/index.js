import { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";
import ExchangeRateAPI from "../exchangeRate_api";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe as timeframeEnum, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";
import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";



