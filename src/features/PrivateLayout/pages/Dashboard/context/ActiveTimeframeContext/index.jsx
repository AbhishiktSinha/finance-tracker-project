import {createContext} from 'react';
import defaults from '../../defaults';

const activeTimeframeContext = createContext(defaults.activeTimeframe);

export default activeTimeframeContext;