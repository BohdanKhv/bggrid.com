import React, { useEffect } from 'react'
import { Button, Collapse } from '../components'
import { rightArrowPointIcon } from '../assets/img/icons'

const FAQ = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'FAQ';
    }, []);

    return (
        <div>
        <main className="page-body">
            <div className="container py-6 px-sm-2 animation-slide-in h-min-100 pt-sm-3">
                <div className="mx-auto w-max-md flex flex-col gap-6 mb-6">
                    <div className="pt-3">
                        <h1 className="title-1 pb-3 bold">
                            FAQ
                        </h1>
                    </div>
                    <div className="flex flex-col">
                        <div className="fs-24 weight-600 mb-4">
                            General Questions
                        </div>
                        <Collapse
                            noArrow
                            label="What is In Crew?"
                            labelClassName="py-2 text-underlined weight-600"
                        >
                            <div className="fs-14 pb-4">
                                In Crew is an online platform that connects employers with job seekers in the food & beverage service industry. Employers can post job listings and job seekers can apply for jobs.
                            </div>
                        </Collapse>
                        <Collapse
                            noArrow
                            label="How do I sign up?"
                            labelClassName="py-2 text-underlined weight-600"
                        >
                            <div className="fs-14 pb-4">
                                We use token to verify your email. You can sign up / sign in using your email address. We will send you a log in link to your email address which you can simply click or copy and paste into your browser to log in.
                            </div>
                        </Collapse>
                    </div>
                    <div className="flex flex-col">
                        <div className="fs-24 weight-600 mb-4">
                            Job Seekers Questions
                        </div>
                            <Collapse
                                noArrow
                                label="How do I apply for a job?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Simply click on the 'Apply' button on the job listing page. You will be prompted to log in or sign up if you haven't already. Once you are logged in, you can apply for a job.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Why do I need to sign up to apply for a job?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    We use token to verify your email. This helps us keep your account secure and ensures that you are the only one who can access your account.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Why some apply buttons redirect me to the employer's website?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    We provide a custom apply url where employers can redirect job seekers to their website or application form.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="How do I bookmark a job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    You can bookmark a job listing by clicking on the 'Bookmark Icon' button on the job listing page.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="What does employer receive when I apply for a job?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Employers will receive your resume and contact information when you apply for a job.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Can I upload my resume?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Yes, you can upload your resume by clicking on the 'Upload Resume' button on the account profile page.
                                </div>
                            </Collapse>
                        </div>
                        <div className="flex flex-col">
                            <div className="fs-24 weight-600 mb-4">
                                Employer Questions
                            </div>
                            <Collapse
                                noArrow
                                label="How do I post a job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    You can post a job listing by clicking on the 'Post a Job' button on the top right corner or follow the link <a href="/new" target="_blank">InCrew.cafe/new</a>.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="How much does it cost to post a job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    It costs $29.99 to post a job listing for 30 days. We also offer a variety of add-ons to help you stand out from the crowd and get your job listing noticed.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Why doest my pinned job post not show up on top?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Your pinned job post will show up on top for the duration you have purchased. If someone else has purchased a pinned job post after you, their job post will show up on top.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="How do I edit my job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    All job listings are final once posted. If you need to make changes to your job listing, please contact us at <a href="mailto:contact@increw.cafe" target="_blank">contact@increw.cafe</a>.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="How do I delete my job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    You can archive your job listing by clicking on the 'Archive' button on the job listing page. If you need to delete your job listing, please contact us at <a href="mailto:contact@increw.cafe" target="_blank">contact@increw.cafe</a>.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Do you offer free job listings?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Yes, we offer 1 free job listing per account. You can post a job listing by clicking on the 'Post a Free Job' button on the top right corner or follow the link <a href="/free" target="_blank">InCrew.cafe/free</a>.
                                </div>
                            </Collapse>
                            <Collapse
                                noArrow
                                label="Ho do I see who has applied to my job listing?"
                                labelClassName="py-2 text-underlined weight-600"
                            >
                                <div className="fs-14 pb-4">
                                    Go to your job listing page and click on the 'View Applicants' button. You will see a list of all the job seekers who have applied to your job listing.
                                </div>
                            </Collapse>
                    </div>
                    <div className="flex flex-col">
                        <div className="fs-14 text-secondary weight-500 mb-4">
                            Didn't find what you were looking for? <br/> Contact us at <a className="text-primary text-underlined" href="mailto:contact@increw.cafe" target="_blank">contact@increw.cafe</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}

export default FAQ