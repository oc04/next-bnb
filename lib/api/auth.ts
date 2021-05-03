import axios from "axios";
import React from "react";
import { UserType } from "../../types/user";

//* 회원가입 body
interface SingUpAPIBody{
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    birthday: string;
}

//* 회원가입 api
export const signupAPI = (body: SingUpAPIBody) => axios.post<UserType>("/api/auth/signup", body);


//* 로그인 api
export const loginAPI = (body: { email: string; password: string; }) => axios.post<UserType>("/api/auth/login", body);


//* 쿠키의 access_token의 유저 정보 받아오는 api
export const meAPI = () => axios.get<UserType>("/api/auth/me");
//export const meAPI = () => axios.get("/api/auth/me");


//* 로그아웃 api
export const logoutAPI = () => axios.delete("/api/auth/logout");