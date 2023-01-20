import React, { useCallback, useState } from 'react'
import { KnownwErrorCode } from '../Models/ApiError';
import { Steps } from '../Models/Wizard';

const FormWizardStateContext = React.createContext(null);
const FormWizardStateUpdateContext = React.createContext(null);

type Direction = "back" | "forward"

type StepError<T> = {
    Code: KnownwErrorCode,
    Step: T
}

export type WizardProvider<T> = {
    currentStepName: T,
    moving: Direction,
    loading: boolean,
    error: StepError<T>,
    wrapperWidth: number,
    wrapperHeight: string,
    goBack: () => void,
    positionPercent: number,
    noToolBar: boolean,
    hideMenu: boolean
}

type UpdateInterface<T> = {
    goToStep: (step: T, move?: Direction) => void,
    setLoading: (value: boolean) => void,
    setError: (error: StepError<T>) => void,
    setWrapperWidth: (value: number) => void,
    setWrapperHeight: (value: string) => void,
    setGoBack: (callback) => void,
    setPositionPercent: (positionPercent: number) => void,
}

type Props<T> = {
    children?: JSX.Element | JSX.Element[];
    initialStep: T,
    initialLoading?: boolean,
    noToolBar?: boolean,
    hideMenu?: boolean
}

export const FormWizardProvider = <T extends Steps>(props: Props<T>) => {
    const { initialStep, initialLoading, children } = props
    const [currentStepName, setCurrentStepName] = useState<T>(initialStep)
    const [moving, setmoving] = useState<Direction>("forward")
    const [loading, setLoading] = useState(initialLoading)
    const [wrapperWidth, setWrapperWidth] = useState(1);
    const [wrapperHeight, setWrapperHeight] = useState(1);
    const [error, setError] = useState<StepError<T>>()

    const [goBack, setGoBack] = useState<{ callback: () => void }>();
    const [positionPercent, setPositionPercent] = useState<() => void>();

    const handleSetCallback = useCallback((callback) => setGoBack({ callback }), [])

    const goToStep = useCallback((step: T, move?: Direction) => {
        setmoving(move || "forward")
        setCurrentStepName(step)
    }, [])

    return (
        <FormWizardStateContext.Provider value={{ currentStepName, moving, loading, error, wrapperWidth, wrapperHeight, goBack: goBack?.callback, positionPercent, noToolBar: props.noToolBar, hideMenu: props.hideMenu }}>
            <FormWizardStateUpdateContext.Provider value={{ goToStep, setLoading, setError, setWrapperWidth, setWrapperHeight, setGoBack: handleSetCallback, setPositionPercent }}>
                {children}
            </FormWizardStateUpdateContext.Provider>
        </FormWizardStateContext.Provider >
    );
}


export function useFormWizardState<T>() {
    const data = React.useContext<WizardProvider<T>>((FormWizardStateContext as unknown) as React.Context<WizardProvider<T>>);
    if (data === undefined) {
        throw new Error('useWizardState must be used within a FormWizardStateContext');
    }

    return data;
}

export function useFormWizardaUpdate<T>() {
    const updateFns = React.useContext<UpdateInterface<T>>(FormWizardStateUpdateContext);

    if (updateFns === undefined) {
        throw new Error('useSwapDataUpdate must be used within a SwapDataProvider');
    }

    return updateFns;
}