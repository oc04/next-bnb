import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import CloseXIcon from "../../public/static/svg/modal/modal_colose_x_icon.svg";
import MailIcon from "../../public/static/svg/auth/mail.svg";
import PersonIcon from "../../public/static/svg/auth/person.svg";
import OpenedEyeIcon from "../../public/static/svg/auth/opened_eye.svg";
import ClosedEyeIcon from "../../public/static/svg/auth/closed_eye.svg";
import palette from "../../styles/palette";
import Input from "../common/Input";
import Selector from "../common/Selector";
import { dayList, monthList, yearList } from "../../lib/staticData";
import Button from "../common/Button";
import { signupAPI } from "../../lib/api/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user";
import useValidateMode from "../../hooks/useValidateMode";
import PasswordWarning from "./PasswordWarning";
import { authActions } from "../../store/auth";



const Container = styled.form`
    width: 568px;
    padding: 32px;
    background-color: white;
    z-index: 11;

    .modal-close-x-icon {
        cursor: pointer;
        display: block;
        margin: 0 0 40px auto;
    }

    .input-wrapper{
        position: relative;
        margin-bottom: 16px;
    }

    .sign-up-password-input-wrapper{
        svg{
            cursor: pointer;
        }
    }

    .sign-up-birthdat-label{
        font-size: 16px;
        font-weight: 600;
        margin-top: 16px;
        margin-bottom: 8px;
    }

    .sign-up-modal-birthday-info{
        margin-bottom: 16px;
        color: ${palette.charcoal};
    }

    .sign-up-modal-birthday-selectors{
        display: flex;
        margin-bottom: 24px;
        .sign-up-modal-birthday-month-selector{
            margin-right: 16px;
            flex-grow: 1;
        }
        .sign-up-modal-birthday-day-selector {
            margin-right: 16px;
            width: 25%;
        }
        .sign-up-modal-birthday-year-selector{
            width: 33.3333%;
        }
    }

    .sign-up-modal-submit-button-wrapper{
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${palette.gray_eb};
    }

    .sign-up-modal-set-login{
        color: ${palette.dark_cyan};
        margin-left: 8px;
        cursor: pointer;
    }
`;

interface IProps {
    closeModal: () => void;
}

//* ????????? ??? ?????? ??? option
const disabledMonths = ["???"];
//* ????????? ??? ?????? ??? option
const disabledDays = ["???"];
//* ????????? ??? ?????? ??? option
const disabledYears = ["???"];

const SignUpModal: React.FC<IProps> = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirsttname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [birthYear, setBirthYear] = useState<string | undefined>();
    const [birthMonth, setBirthMonth] = useState<string | undefined>();
    const [birthDay, setBirthDay] = useState<string | undefined>();
    const dispatch = useDispatch();
    const { setValidateMode } = useValidateMode();

    //* ????????? ????????? ????????????
    const changeToLoginModal = () => {
        dispatch(authActions.setAuthMode("login"));
    };

    //* ???????????? ?????? ????????????
    const toggleHidePassword = () => {
        setHidePassword(!hidePassword);
    };

    //* ???????????? ?????? ????????? ????????? ???
    const onFocusPassword = () => {
        setPasswordFocused(true);
    };

    //* password??? ???????????? ???????????? ???????????????
    const isPasswordHasNameOrEmail = useMemo(() =>
        !password ||
        !lastname ||
        password.includes(lastname) ||
        password.includes(email.split("@")[0]),
        [password, lastname, email]
    );

    //* ???????????? ?????? ?????????
    const PASSWORD_MIN_LENGTH = 8;

    //* ???????????? ?????? ????????? ????????????
    const isPasswordOverMinLength = useMemo(()=> !!password && password.length >= PASSWORD_MIN_LENGTH, [password]);

    //* ??????????????? ????????? ??????????????? ???????????????
    const isPasswordHasNumberOrSymbol = useMemo(() => !( /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) || /[0-9]/g.test(password)), [password]);
    
    //* ????????? ?????? ?????? ???
    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    //* ?????? ?????? ?????? ???
    const onChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastname(event.target.value);
    };

    //* ??? ?????? ?????? ???
    const onChangeFristname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirsttname(event.target.value);
    };

    //* ???????????? ?????? ?????? ???
    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    //* ???????????? ??? ?????? ???
    const onChangeBirthMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthMonth(event.target.value);
    };
    
    //* ???????????? ??? ?????? ???
    const onChangeBirthDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthDay(event.target.value);
    };

    //* ???????????? ??? ?????? ???
    const onChangeBirthYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthYear(event.target.value);
    };



    //* ???????????? ??? ?????? ??? ????????????
    const validateSignUpForm = () => {
        //* ?????? ?????? ?????????
        if(!email || !lastname ||  !firstname || !password){
            return false;
        }
        //* ??????????????? ???????????? ?????????
        if(
            isPasswordHasNameOrEmail ||
            !isPasswordOverMinLength ||
            isPasswordHasNumberOrSymbol
        ){
            return false;
        }
        //* ???????????? ????????? ?????? ?????????
        if(!birthDay || !birthMonth || !birthYear){
            return false;
        }
        return true;
    };
    
    //* ???????????? ??? ????????????
    const onSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setValidateMode(true);

        if(validateSignUpForm()){
            try{
                const signUpBody ={
                    email,
                    lastname,
                    firstname,
                    password,
                    birthday: new Date( `${birthYear}-${birthMonth!.replace("???","")}-${birthDay}`).toISOString(),
                };

                const { data } = await signupAPI(signUpBody);

                dispatch(userActions.setLoggedUser(data));

                closeModal()

            }catch (e){
                console.log(e);
            }
        }
    };

    useEffect(() => {
        return () => {
            setValidateMode(false);
        }
    }, []);

    return (
        <Container onSubmit={onSubmitSignUp}>
            <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
            <div className="input-wrapper">
                <Input placeholder="????????? ??????" type="email" icon={<MailIcon />} name="email" value={email} onChange={onChangeEmail} useValidation isValid={!!email} errorMessage="???????????? ???????????????." />
            </div>
            <div className="input-wrapper">
                <Input placeholder="??????(???:??????)" icon={<PersonIcon />} value={lastname} onChange={onChangeLastname}  useValidation isValid={!!lastname} errorMessage="????????? ???????????????." />
            </div>
            <div className="input-wrapper">
                <Input placeholder="???(???:???)" icon={<PersonIcon />} value={firstname} onChange={onChangeFristname}  useValidation isValid={!!firstname} errorMessage="?????? ???????????????." />
            </div>
            <div className="input-wrapper sign-up-password-input-wrapper">
                <Input placeholder="???????????? ????????????" 
                    onFocus={onFocusPassword} 
                    type={hidePassword ? "password" : "text"} 
                    icon={hidePassword ? (<ClosedEyeIcon onClick={toggleHidePassword} />):(<OpenedEyeIcon onClick={toggleHidePassword} />)} 
                    value={password} 
                    onChange={onChangePassword}
                    useValidation 
                    isValid={!isPasswordHasNameOrEmail && isPasswordOverMinLength && !isPasswordHasNumberOrSymbol} 
                    errorMessage="??????????????? ???????????????." 
                />
            </div>
            {passwordFocused && (
                <>
                    <PasswordWarning
                        isValid={isPasswordHasNameOrEmail}
                        text="??????????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????."
                    />
                    <PasswordWarning isValid={!isPasswordOverMinLength} text="?????? 8???" />
                    <PasswordWarning
                        isValid={isPasswordHasNumberOrSymbol}
                        text="????????? ????????? ???????????????."
                    />
                </>
            )}
            <p className="sign-up-birthdat-label">??????</p>
            <p className="sign-up-modal-birthday-info">
                ??? 18??? ????????? ????????? ???????????? ????????? ??? ????????????. ????????? ?????? ??????????????? ??????????????? ???????????? ????????????.
            </p>
            <div className="sign-up-modal-birthday-selectors">
                <div className="sign-up-modal-birthday-month-selector">
                    <Selector options={monthList} defaultValue="???" value={birthMonth} onChange={onChangeBirthMonth} isValid={!!birthMonth} disabledOptions={disabledMonths} />
                </div>
                <div className="sign-up-modal-birthday-day-selector">
                    <Selector options={dayList} defaultValue="???" value={birthDay} onChange={onChangeBirthDay} isValid={!!birthDay} disabledOptions={disabledDays} />
                </div>
                <div className="sign-up-modal-birthday-year-selector">
                    <Selector options={yearList} defaultValue="???" value={birthYear} onChange={onChangeBirthYear} isValid={!!birthYear} disabledOptions={disabledYears} />
                </div>
            </div>

            <div className="sign-up-modal-submit-button-wrapper">
                <Button type="submit">????????????</Button>
            </div>
            <p>
                ?????? ??????????????? ????????? ??????????
                <span
                    className="sign-up-modal-set-login"
                    role="presentation"
                    onClick={changeToLoginModal}
                >
                ?????????
                </span>
            </p>
        </Container>
    );
};

export default SignUpModal;