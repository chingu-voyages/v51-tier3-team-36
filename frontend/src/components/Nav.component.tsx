import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from '@nextui-org/react'
import { Link as RouterLink } from 'react-router-dom'

export default function Nav() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <p className="font-bold text-inherit">Expense Splitter</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <RouterLink to={'login'}>Login</RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink to={'signup'}>
            <Button as={Link} color="primary" variant="flat">
              SignUp
            </Button>
          </RouterLink>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
