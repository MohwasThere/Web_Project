'use client'
import { CountrySelectField } from "@/components/forms/countryselect";
import Footerlink from "@/components/forms/footerlink";
import InputField from "@/components/forms/Inputsfield";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import React from "react";
import { SubmitHandler, useForm ,Controller} from "react-hook-form";


const SignUP=() =>{

      const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignUpFormData>(
        {  
            defaultValues:{
            fullName:'',
            email:'',
            password:'',
            country:'Egy',
            investmentGoals:'Growth',
            riskTolerance:'Medium',
            preferredIndustry:'Technology'
        }
               ,mode:'onBlur'});
        const onSubmit = async (data:SignUpFormData)=> {
                    try{
                        console.log(data);}
                catch(e){
                console.log(errors);}}
  return(
     <> 
        <h1 className="form-title">Sign up & Personalize</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <InputField
                    name="fullName"
                    label="full Name"
                    placeholder="Mahmoud"
                    register={register}
                    error={errors.fullName}
                    validation={{required:"Full name is required", minLength:2}}>
                </InputField>
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


                    <CountrySelectField

                            name="Country"
                            label="Country"
                            control={control}
                            error={errors.country}
                            required
                    />
                    <SelectField
                    name="investmentGoals"
                    label="InvestmentGoals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                    
                    >
                </SelectField>
                    
                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                    
                    >
                </SelectField>

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                    
                    >
                </SelectField>

                
            <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                {isSubmitting? 'Creating account': 'Start Your Investing Journey'}

            </Button>
            <Footerlink
                    text="Already have an account?" 
                    linkText="Sign in"
                    href="/sign-in" />


        </form>
     </>
  );
}
export default SignUP;
