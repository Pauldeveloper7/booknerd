"use client"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
const SignupForm = () => {
  const navigate = useNavigate();
  const {checkAuthUser } = useUserContext()
 const  { mutateAsync : createUserAccount , isPending: isCreatingAccount} = useCreateUserAccount();
 const { mutateAsync: signInAccount} = useSignInAccount();
 
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:"",
      username: "",
      email:"",
      password:""

    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    console.log(newUser)
    if(!newUser){
      return toast("Sign up failed .Kindly try again ..");
    }
    const session = await  signInAccount({
      email :values.email,
      password: values.password
    })
    if(!session){
      return toast("Sign in failed . Please try again ");
    }
     const isLoggedIn = await  checkAuthUser();
     if(isLoggedIn){
      form.reset();
      navigate("/")
     }
     else{
     return  toast("Sign up failed . Please try again . ")
     }
  }
  return (
<Form {...form}>
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.png" alt="logo"  width={"130px"} height={"130px"} />
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Create a new account</h2>
      <p className=" text-light-3 small-medium  md:base-regular mt-2">To use booknerd , Kindly enter your account details </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5  w-full  mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text"  className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text"  className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email"  className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="Password"  className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount?  (
            <div className=" flex-center gap-2 "><Loader/> loading ...</div>
          ):"Sign Up"}
        </Button> 
        <p className=" text-small-regular text-light-2 text-center mt-2">
          Already have an account ? <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
        </p>
      </form>
      </div> 

    </Form>    
  )
}
export default SignupForm