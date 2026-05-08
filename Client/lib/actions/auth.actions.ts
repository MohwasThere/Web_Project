'use server';

import {auth} from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { success } from "better-auth";
import { count } from "console";

export const signUpWithEmail = async({email, password, fullName, investmentGoals, riskTolerance, country, preferredIndustry}: SignUpFormData) => {
    try{
        const response = await auth.api.signUpEmail({
            body: {
                email, 
                password,
                name: fullName,
            }

        })

        if (response) {
            await inngest.send({
                name: 'app/user,created',
                data : {
                    email, 
                    password,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }
        return {success: true, data:response}
    }catch(err) {
        console.log('Sign up failed', err)
        return{success: false, error :'Sign up failed'}
    }
}