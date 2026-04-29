'use client'
import Footerlink from "@/components/forms/footerlink";
import InputField from "@/components/forms/Inputsfield";
import { Button } from "@/components/ui/button";
import React from "react";
import { SubmitHandler, useForm ,Controller} from "react-hook-form";

const SignIn=() =>{
        const { register, handleSubmit, formState: { errors, isSubmitting} } = useForm<SignInFormData>(
        {  
            defaultValues:{
            email:'',
            password:'',
        }
               ,mode:'onBlur'});
        const onSubmit = async (data:SignInFormData)=> {
                    try{
                        console.log(data);}
                catch(e){
                console.log(errors);}}
  return(
     <> 
        <h1 className="form-title">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                 <InputField
                    name="email"
                    label="Email"
                    placeholder="example@gamil.com"
                    register={register}
                    error={errors.email}
                    validation={{required:"Email is required", minLength:2,pattern:/^\w+@\w+\.\w+$/, message:"Email address is required"}}>
                </InputField>
                 <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter a Strong Password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{required:"Password is required", minLength:8}}>
                </InputField>


                
            <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                {isSubmitting? 'Sign in ': 'Start Your Investing Journey'}

            </Button>
            <Footerlink
                    text="Create an account?" 
                    linkText="Sign up"
                    href="/sign-up" />


        </form>
     </>
  );
}
export default SignIn;
