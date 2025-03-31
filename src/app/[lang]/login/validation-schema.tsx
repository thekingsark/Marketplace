import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
})

export const resetPassSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
})
