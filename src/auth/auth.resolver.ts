import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import CurrentUserOutput from 'src/dto/current-user.output'
import AuthInput from './dto/auth.input'
import SignInService from './services/sign-in'
import SignUpService from './services/sign-up'
import { ContextType } from './types'

@Resolver()
export default class AuthResolver {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly signInService: SignInService
  ) {}

  @Mutation(() => CurrentUserOutput)
  async signUp(@Args('input') input: AuthInput, @Context() context: ContextType): Promise<CurrentUserOutput> {
    return this.signUpService.process(input, context)
  }

  @Mutation(() => CurrentUserOutput)
  async signIn(@Args('input') input: AuthInput, @Context() context: ContextType): Promise<CurrentUserOutput> {
    return this.signInService.process(input, context)
  }

  @Mutation(() => CurrentUserOutput)
  async signOut(@Context() context: ContextType): Promise<CurrentUserOutput> {
    return this.signInService.signOut(context)
  }
}
