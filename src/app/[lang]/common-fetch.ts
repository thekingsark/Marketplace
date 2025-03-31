export const getCategories = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/category`, {
      next: { revalidate: 60 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch categories: ${error}`)
    return []
  }
}

export const getCurrencies = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/currency`, {
      next: { revalidate: 3600 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch currencies: ${error}`)
    return []
  }
}

export const getPaymentProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/web-payment-product`, {
      next: { revalidate: 3600 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch payment products: ${error}`)
    return []
  }
}

export const getExchangeRates = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/exchange-rate`, {
      // Revalidate every 15 minutes
      next: { revalidate: 900 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch exchange rates: ${error}`)
    return []
  }
}

export const getAvailablePayments = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/available-payments`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch available payments: ${error}`)
    return []
  }
}

export const getSettings = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/settings`, {
      next: { revalidate: 100 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch settings: ${error}`)
    return []
  }
}
