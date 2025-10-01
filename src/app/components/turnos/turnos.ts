import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnosService } from '../../services/turnos'; 
import { AuthService } from '../../services/auth';     

interface TurnoDTO {
  nombreServicio: string;
  nombreComercio: string;
  fecha: string; 
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css']
})
export class TurnosComponent implements OnInit {
  usuario: string | null = '';
  fechaInicio = '';
  fechaFin = '';
  idServicio = ''; 
  turnos: TurnoDTO[] = [];

  constructor(private turnosService: TurnosService, private auth: AuthService) {}

  ngOnInit() {
    this.usuario = this.auth.getUsuario();
  }

  generarTurnos() {
    const idServicioNum = this.idServicio ? parseInt(this.idServicio, 10) : null;
    
    const data = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idServicio: idServicioNum 
    };

    this.turnosService.generarTurnos(data).subscribe({
      next: (res: TurnoDTO[]) => {
        console.log('Respuesta del backend:', res);
        this.turnos = res; 
      },
      error: (err) => {
        console.error('Error al generar turnos:', err);
      }
    });
  }
}