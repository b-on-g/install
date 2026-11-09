namespace $.$$ {

	type Install_prompt = Event & {
		prompt(): Promise<void>
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
	}

	export class $bog_install extends $.$bog_install {

		@ $mol_mem
		prompt_event( next?: Install_prompt | null ) {
			return next ?? null
		}

		@ $mol_mem
		installed( next?: boolean ) {
			return next ?? false
		}

		@ $mol_action
		prompt_capture( event: Install_prompt ) {
			event.preventDefault()
			this.prompt_event( event )
		}

		@ $mol_mem
		listeners() {
			const win = this.$.$mol_dom_context

			return [
				new $mol_dom_listener( win, 'beforeinstallprompt', ( event: Install_prompt )=> this.prompt_capture( event ) ),
				new $mol_dom_listener( win, 'appinstalled', ()=> {
					this.prompt_event( null )
					this.installed( true )
				} ),
			]
		}

		override auto() {
			super.auto()
			this.listeners()
		}

		@ $mol_action
		install() {
			const prompt = this.prompt_event()

			if( prompt ) {
				prompt.prompt()
				prompt.userChoice.finally( ()=> this.prompt_event( null ) )
				return
			}

			if( this.installed() || this.$.$mol_dom_context.matchMedia?.( '(display-mode: standalone)' )?.matches || ( this.$.$mol_dom_context.navigator as any ).standalone ) {
				this.$.$mol_dom_context.alert( this.install_already_installed() )
				return
			}

			const agent = this.$.$mol_dom_context.navigator.userAgent

			if( /iPad|iPhone|iPod/.test( agent ) ) {
				this.$.$mol_dom_context.alert( this.install_ios_instruction() )
				return
			}

			if( /Android/.test( agent ) ) {
				this.$.$mol_dom_context.alert( this.install_android_instruction() )
				return
			}

			if( /Windows|Macintosh|Linux/.test( agent ) ) {
				this.$.$mol_dom_context.alert( this.install_desktop_instruction() )
				return
			}

			this.$.$mol_dom_context.alert( this.install_unsupported_browser() )
		}

	}

}
