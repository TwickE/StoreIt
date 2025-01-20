"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image"

import { useState, MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions"
import { useRouter } from "next/navigation"


const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOtpError(false);
        setIsLoading(true);
        try {
            const sessionId = await verifySecret({ accountId, password });
            if(sessionId) {
                router.push("/");
            }
        } catch (error) {
            console.log("Failed to verify OTP", error);
            setOtpError(true);
            setIsLoading(false);

        }
    }

    const handleResendOTP = async () => {
        await sendEmailOTP({ email });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader className="relative flex justify-center">
                    <AlertDialogTitle className="h2 text-center">
                        Enter your OTP
                        <Image
                            src="/assets/icons/close-dark.svg"
                            width={20}
                            height={20}
                            onClick={() => setIsOpen(false)}
                            className="otp-close-button"
                            alt="close button"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                        We&apos;ve sent an OTP code to <span className="pl-1 text-brand">{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" />
                        <InputOTPSlot index={1} className="shad-otp-slot" />
                        <InputOTPSlot index={2} className="shad-otp-slot" />
                        <InputOTPSlot index={3} className="shad-otp-slot" />
                        <InputOTPSlot index={4} className="shad-otp-slot" />
                        <InputOTPSlot index={5} className="shad-otp-slot" />
                    </InputOTPGroup>
                </InputOTP>

                <AlertDialogFooter>
                    <div className="flex w-full flex-col gap-4">
                        {otpError && (
                            <p className="error-message text-center">Invalid OTP. Please try again.</p>
                        )}
                        <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button" disabled={isLoading}>
                            Submit
                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="ml-2 animate-spin"
                                />
                            )}
                        </AlertDialogAction>
                        <div className="subtitle-2 mt-2 text-center text-light-100">
                            Didn&apos;t recive a code?
                            <Button
                                type="button"
                                variant="link"
                                className="pl-1 text-brand"
                                onClick={handleResendOTP}
                            >
                                Click to resend OTP
                            </Button>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OTPModal