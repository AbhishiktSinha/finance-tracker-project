import { useEffect, useRef, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx'

import privateContext from '../../context/index.jsx';

import OnboardingForm from './components/OnboardingForm/index.jsx'
import BalanceCard from './components/BalanceCard/index.jsx'

import { selectIsDefaultCurrencySet, selectStatus } from './redux/selectors.js'
import { consoleDebug, consoleError } from '../../../../console_styles/index.js';

import Skeleton from './components/Skeleton/index.jsx';
import { fetchUserDocThunk, updateExchangeRateThunk } from '../../redux/thunk.js';

import './stlyes.css';

export {
    useEffect, useRef, useContext,
    useDispatch, useSelector,
    Button,
    PlusOutlined,
    ModalWrapper,
    privateContext,
    OnboardingForm,
    BalanceCard,
    selectIsDefaultCurrencySet, selectStatus,
    consoleDebug, consoleError,
    Skeleton,
    fetchUserDocThunk, updateExchangeRateThunk
}