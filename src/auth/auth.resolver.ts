import { Args, Mutation, Resolver } from '@nestjs/graphql'
import AuthInput from './dto/auth.input'
import AuthOutput from './dto/auth.output'
import SignInService from './services/sign-in'
import SignUpService from './services/sign-up'

@Resolver()
export default class AuthResolver {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly signInService: SignInService
  ) {}

  @Mutation(() => AuthOutput)
  async signUp(@Args('input') input: AuthInput): Promise<AuthOutput> {
    return this.signUpService.process(input)
  }

  @Mutation(() => AuthOutput)
  async signIn(@Args('input') input: AuthInput): Promise<AuthOutput> {
    return this.signInService.process(input)
  }
}
