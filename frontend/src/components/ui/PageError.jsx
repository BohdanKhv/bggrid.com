import { errorIcon } from "../../assets/img/icons"
import Button from "../ui/Button"

const PageError = () => {
    return (
        <div className="flex flex-col align-center justify-center px-lg-2 h-min-100 h-100">
            <div className="icon icon-xl mb-5">
                {errorIcon}
            </div>
            <p className="fs-20 text-center">
                Something went wrong
            </p>
            <p className="fs-12 text-center text-secondary mt-1">
                Please try again.<br/>If the problem persists, contact support.
                <br/>
            </p>
            <div className="flex align-center mt-4 gap-2">
                <Button
                    type="primary"
                    variant="outline"
                    label="Support"
                    borderRadius="lg"
                    onClick={() => window.open('mailto:contact@increw.cafe?subject=Support Request&body=Please describe your issue in detail.')}
                />
                <Button
                    label="Try again"
                    onClick={() => window.location.reload()}
                    type="primary"
                    variant="filled"
                    borderRadius="lg"
                />
            </div>
        </div>
    )
}

export default PageError