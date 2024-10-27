import { ErrorBoundary } from "react-error-boundary";
import { PageError } from '../'
import { useDispatch } from "react-redux";


const ErrBoundary = ({children}) => {
  const dispatch = useDispatch()

  const sendErrorReport = (error, info) => {
    const errMessage = error.message
    const errStack = error.stack
    const location = window?.location?.href
    const userAgent = window?.navigator?.userAgent
  }

  return (
    <ErrorBoundary
      FallbackComponent={() => <PageError/>}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
      // log the error with your preferred logging library
      onError={sendErrorReport}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrBoundary