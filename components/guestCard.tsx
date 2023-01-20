import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useFormWizardaUpdate, useFormWizardState } from '../context/formWizardProvider';
import { AuthStep } from '../Models/Wizard';
import CodeStep from './Wizard/Steps/CodeStep';
import EmailStep from './Wizard/Steps/EmailStep';
import Wizard from './Wizard/Wizard';
import WizardItem from './Wizard/WizardItem';

function GuestCard() {
    const { goToStep } = useFormWizardaUpdate()
    const { goBack, noToolBar } = useFormWizardState()
    const router = useRouter();
    const { redirect } = router.query;

    const CodeOnNext = useCallback(async () => {
        await router.push(redirect?.toString() || '/')
    }, [redirect]);
    const GoBackToEmailStep = useCallback(() => goToStep(AuthStep.Email, "back"), [])
    const GoToCodeStep = useCallback(() => goToStep(AuthStep.Code), [])

    return (
        <div className='mt-10'>
            <Wizard>
                <WizardItem StepName={AuthStep.Email} fitHeight>
                    <div className={noToolBar ? `p-6 border border-darkblue-400 rounded-md` : "pt-6"}>
                        <EmailStep OnNext={GoToCodeStep} disclosureLogin />
                    </div>
                </WizardItem>
                <WizardItem StepName={AuthStep.Code} GoBack={GoBackToEmailStep} fitHeight>
                    <div className={noToolBar ? `p-6 border border-darkblue-400 rounded-md` : "pt-6"}>
                        {goBack &&
                            <button onClick={goBack} className="justify-self-start" style={{ visibility: false ? 'hidden' : 'visible' }}>
                                <ArrowLeftIcon className='h-5 w-5 text-primary-text hover:text-darkblue-500 cursor-pointer' />
                            </button>
                        }
                        <CodeStep OnNext={CodeOnNext} disclosureLogin />
                    </div>
                </WizardItem>
            </Wizard>
        </div>
    );
}

export default GuestCard;

